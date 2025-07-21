import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AUTH_CONFIG } from "../../config/auth-config";
import { AUTH_MESSAGES, VALIDATION_MESSAGES } from "../messages";
import { IUser } from "../../models/user-model";
import { Types } from "mongoose";

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  sessionId: string;
}

export interface RefreshTokenPayload {
  userId: string;
  sessionId: string;
}

// Password utilities
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, AUTH_CONFIG.PASSWORD.SALT_ROUNDS);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export const validatePassword = (
  password: string
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < AUTH_CONFIG.PASSWORD.MIN_LENGTH) {
    errors.push(
      `Password must be at least ${AUTH_CONFIG.PASSWORD.MIN_LENGTH} characters long`
    );
  }

  if (AUTH_CONFIG.PASSWORD.REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
    errors.push(VALIDATION_MESSAGES.PASSWORD_MUST_CONTAIN_UPPERCASE);
  }

  if (AUTH_CONFIG.PASSWORD.REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
    errors.push(VALIDATION_MESSAGES.PASSWORD_MUST_CONTAIN_LOWERCASE);
  }

  if (AUTH_CONFIG.PASSWORD.REQUIRE_NUMBERS && !/\d/.test(password)) {
    errors.push(VALIDATION_MESSAGES.PASSWORD_MUST_CONTAIN_NUMBER);
  }

  if (
    AUTH_CONFIG.PASSWORD.REQUIRE_SPECIAL_CHARS &&
    !/[!@#$%^&*(),.?":{}|<>]/.test(password)
  ) {
    errors.push(VALIDATION_MESSAGES.PASSWORD_MUST_CONTAIN_SPECIAL);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// JWT utilities
export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, AUTH_CONFIG.JWT.ACCESS_TOKEN_SECRET, {
    expiresIn: AUTH_CONFIG.JWT.ACCESS_TOKEN_EXPIRES_IN,
    issuer: AUTH_CONFIG.JWT.ISSUER,
    audience: AUTH_CONFIG.JWT.AUDIENCE,
  });
};

export const generateRefreshToken = (payload: RefreshTokenPayload): string => {
  return jwt.sign(payload, AUTH_CONFIG.JWT.REFRESH_TOKEN_SECRET, {
    expiresIn: AUTH_CONFIG.JWT.REFRESH_TOKEN_EXPIRES_IN,
    issuer: AUTH_CONFIG.JWT.ISSUER,
    audience: AUTH_CONFIG.JWT.AUDIENCE,
  });
};

export const verifyAccessToken = (token: string): TokenPayload => {
  try {
    const decoded = jwt.verify(token, AUTH_CONFIG.JWT.ACCESS_TOKEN_SECRET, {
      issuer: AUTH_CONFIG.JWT.ISSUER,
      audience: AUTH_CONFIG.JWT.AUDIENCE,
    }) as TokenPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error(AUTH_MESSAGES.TOKEN_EXPIRED);
    }
    throw new Error(AUTH_MESSAGES.TOKEN_INVALID);
  }
};

export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  try {
    const decoded = jwt.verify(token, AUTH_CONFIG.JWT.REFRESH_TOKEN_SECRET, {
      issuer: AUTH_CONFIG.JWT.ISSUER,
      audience: AUTH_CONFIG.JWT.AUDIENCE,
    }) as RefreshTokenPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error(AUTH_MESSAGES.REFRESH_TOKEN_EXPIRED);
    }
    throw new Error(AUTH_MESSAGES.REFRESH_TOKEN_INVALID);
  }
};

// Session utilities
export const generateSessionId = (): string => {
  return new Types.ObjectId().toString();
};

export const calculateTokenExpiry = (): Date => {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + AUTH_CONFIG.SESSION.SESSION_EXPIRY_DAYS);
  return expiry;
};

// User validation utilities
export const validateUserForAuth = (
  user: IUser | null
): { isValid: boolean; error?: string } => {
  if (!user) {
    return { isValid: false, error: AUTH_MESSAGES.USER_NOT_FOUND };
  }

  if (!user.isActive) {
    return { isValid: false, error: AUTH_MESSAGES.USER_INACTIVE };
  }

  if (!user.isVerified) {
    return { isValid: false, error: AUTH_MESSAGES.USER_UNVERIFIED };
  }

  return { isValid: true };
};
