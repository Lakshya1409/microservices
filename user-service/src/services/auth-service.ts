import { Request } from "express";
import { Types } from "mongoose";
import { UserRepository } from "../repositories";
import { UserSessionRepository } from "../repositories/user-session-repository";
import { IUser } from "../models/user-model";
import { IUserSession } from "../models/user-session-model";

import {
  hashPassword,
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  generateSessionId,
  calculateTokenExpiry,
  validateUserForAuth,
  TokenPayload,
  RefreshTokenPayload,
} from "../utils/auth";
import { AUTH_CONFIG } from "../config/auth-config";
import { AUTH_MESSAGES, USER_MESSAGES } from "../utils/messages";
import { logger } from "../config/logger-config";
import { notificationPublisher } from "../events/publishers";
import { EVENT_PRIORITY, EVENT_TYPES } from "../utils";

const userRepository = new UserRepository();
const userSessionRepository = new UserSessionRepository();

export interface LoginRequest {
  email: string;
  password: string;
  deviceInfo?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: Date;
  gender?: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    isVerified: boolean;
  };
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface LogoutRequest {
  sessionId: string;
}

export const authService = {
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const { email, password, ...userInfo } = userData;

    // Check if user already exists
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error(AUTH_MESSAGES.EMAIL_ALREADY_EXISTS);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await userRepository.create({
      ...userInfo,
      email,
      password: hashedPassword,
      isVerified: true, // Auto-verify for development
      isActive: true,
      role: "customer",
    });

    try {
      await notificationPublisher.setup();
      await notificationPublisher.publishEmail(
        String(user._id),
        EVENT_TYPES.USER_REGISTERED,
        {
          name: `${user.firstName} ${user.lastName}`,
          email,
        }
      );
      logger.info(`Welcome notifications sent for user: ${email}`);
    } catch (error) {
      logger.error(
        `Failed to send welcome notifications for user ${email}: ${error}`
      );
      // Don't fail registration if notifications fail
    }

    const sessionId = generateSessionId();
    const accessTokenPayload: TokenPayload = {
      userId: (user._id as Types.ObjectId).toString(),
      email: user.email,
      role: user.role,
      sessionId,
    };

    const refreshTokenPayload: RefreshTokenPayload = {
      userId: (user._id as Types.ObjectId).toString(),
      sessionId,
    };

    const accessToken = generateAccessToken(accessTokenPayload);
    const refreshToken = generateRefreshToken(refreshTokenPayload);

    await userSessionRepository.create({
      userId: user._id as Types.ObjectId,
      token: accessToken,
      refreshToken,
      deviceInfo: USER_MESSAGES.REGISTRATION_DEVICE,
      ipAddress: USER_MESSAGES.REGISTRATION_IP,
      userAgent: USER_MESSAGES.REGISTRATION_USER_AGENT,
      isActive: true,
      expiresAt: calculateTokenExpiry(),
    });

    await userRepository.updateLastLogin(user._id as Types.ObjectId);

    logger.info(`User registered successfully: ${email}`);

    return {
      user: {
        id: (user._id as Types.ObjectId).toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isVerified: user.isVerified,
      },
      accessToken,
      refreshToken,
      expiresIn: 15 * 60, // 15 minutes in seconds
    };
  },

  async login(loginData: LoginRequest, req: Request): Promise<AuthResponse> {
    const { email, password, deviceInfo, ipAddress, userAgent } = loginData;

    // Find user
    const user = await userRepository.findByEmail(email);
    const userValidation = validateUserForAuth(user);
    if (!userValidation.isValid) {
      throw new Error(userValidation.error);
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user!.password);
    if (!isPasswordValid) {
      throw new Error(AUTH_MESSAGES.INVALID_CREDENTIALS);
    }

    // Check active sessions limit
    const activeSessions = await userSessionRepository.findActiveByUserId(
      user!._id as Types.ObjectId
    );
    if (activeSessions.length >= AUTH_CONFIG.SESSION.MAX_ACTIVE_SESSIONS) {
      // Remove oldest session
      const oldestSession = activeSessions.sort(
        (a: IUserSession, b: IUserSession) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )[0];
      await userSessionRepository.deactivateSession(
        oldestSession._id as Types.ObjectId
      );
    }

    // Create new session
    const sessionId = generateSessionId();
    const accessTokenPayload: TokenPayload = {
      userId: (user!._id as Types.ObjectId).toString(),
      email: user!.email,
      role: user!.role,
      sessionId,
    };

    const refreshTokenPayload: RefreshTokenPayload = {
      userId: (user!._id as Types.ObjectId).toString(),
      sessionId,
    };

    const accessToken = generateAccessToken(accessTokenPayload);
    const refreshToken = generateRefreshToken(refreshTokenPayload);

    // Save session
    await userSessionRepository.create({
      userId: user!._id as Types.ObjectId,
      token: accessToken,
      refreshToken,
      deviceInfo: deviceInfo || "Unknown Device",
      ipAddress: ipAddress || req.ip || "Unknown IP",
      userAgent: userAgent || req.get("User-Agent") || "Unknown User Agent",
      isActive: true,
      expiresAt: calculateTokenExpiry(),
    });

    // Update last login
    await userRepository.updateLastLogin(user!._id as Types.ObjectId);

    logger.info(`User logged in successfully: ${email}`);

    return {
      user: {
        id: (user!._id as Types.ObjectId).toString(),
        email: user!.email,
        firstName: user!.firstName,
        lastName: user!.lastName,
        role: user!.role,
        isVerified: user!.isVerified,
      },
      accessToken,
      refreshToken,
      expiresIn: 15 * 60, // 15 minutes in seconds
    };
  },

  async refreshToken(
    refreshData: RefreshTokenRequest
  ): Promise<{ accessToken: string; expiresIn: number }> {
    const { refreshToken } = refreshData;

    // Verify refresh token
    const payload = verifyRefreshToken(refreshToken);

    // Check if session exists and is active
    const session = await userSessionRepository.findBySessionId(
      payload.sessionId
    );
    if (
      !session ||
      !session.isActive ||
      session.refreshToken !== refreshToken
    ) {
      throw new Error(AUTH_MESSAGES.REFRESH_TOKEN_INVALID);
    }

    // Check if session has expired
    if (new Date() > session.expiresAt) {
      await userSessionRepository.deactivateSession(
        session._id as Types.ObjectId
      );
      throw new Error(AUTH_MESSAGES.SESSION_EXPIRED);
    }

    // Get user
    const user = await userRepository.findById(payload.userId);
    const userValidation = validateUserForAuth(user);
    if (!userValidation.isValid) {
      throw new Error(userValidation.error);
    }

    // Generate new access token
    const accessTokenPayload: TokenPayload = {
      userId: (user!._id as Types.ObjectId).toString(),
      email: user!.email,
      role: user!.role,
      sessionId: payload.sessionId,
    };

    const accessToken = generateAccessToken(accessTokenPayload);

    // Update session with new token
    await userSessionRepository.updateToken(
      session._id as Types.ObjectId,
      accessToken
    );

    logger.info(`Token refreshed for user: ${user!.email}`);

    return {
      accessToken,
      expiresIn: 15 * 60, // 15 minutes in seconds
    };
  },

  async logout(logoutData: LogoutRequest): Promise<void> {
    const { sessionId } = logoutData;

    // Deactivate session
    await userSessionRepository.deactivateSession(
      new Types.ObjectId(sessionId)
    );

    logger.info(`User logged out, session deactivated: ${sessionId}`);
  },

  async logoutAllSessions(userId: string): Promise<void> {
    // Deactivate all sessions for user
    await userSessionRepository.deactivateAllByUserId(
      new Types.ObjectId(userId)
    );

    logger.info(`All sessions logged out for user: ${userId}`);
  },

  async validateSession(
    sessionId: string
  ): Promise<{ isValid: boolean; user?: IUser }> {
    const session = await userSessionRepository.findBySessionId(sessionId);

    if (!session || !session.isActive) {
      return { isValid: false };
    }

    if (new Date() > session.expiresAt) {
      await userSessionRepository.deactivateSession(
        session._id as Types.ObjectId
      );
      return { isValid: false };
    }

    const user = await userRepository.findById(session.userId.toString());
    const userValidation = validateUserForAuth(user);

    if (!userValidation.isValid) {
      return { isValid: false };
    }

    return { isValid: true, user: user! };
  },
};
