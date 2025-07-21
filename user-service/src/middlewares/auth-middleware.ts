import { Request, Response, NextFunction } from "express";
import { verifyAccessToken, TokenPayload } from "../utils/auth";
import { authService } from "../services/auth-service";
import { isPublicRoute } from "../config/public-routes-config";
import { AUTH_MESSAGES, ERROR_MESSAGES } from "../utils/messages";
import { ResponseUtils, ErrorCodes } from "../utils/response";
import { logger } from "../config/logger-config";

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role: string;
        sessionId: string;
      };
    }
  }
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Check if route is public (exempt from authentication)
    if (isPublicRoute(req.path, req.method)) {
      logger.debug(`Public route accessed: ${req.method} ${req.path}`);
      return next();
    }

    // Get token from header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      ResponseUtils.unauthorized(
        res,
        AUTH_MESSAGES.TOKEN_MISSING,
        ErrorCodes.INVALID_TOKEN
      );
      return;
    }

    try {
      // Verify token
      const payload = verifyAccessToken(token) as TokenPayload;

      // Validate session
      const sessionValidation = await authService.validateSession(
        payload.sessionId
      );
      if (!sessionValidation.isValid) {
        ResponseUtils.unauthorized(
          res,
          AUTH_MESSAGES.SESSION_EXPIRED,
          ErrorCodes.SESSION_EXPIRED
        );
        return;
      }

      // Attach user to request
      req.user = {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
        sessionId: payload.sessionId,
      };

      logger.debug(
        `Authenticated user: ${payload.email} for ${req.method} ${req.path}`
      );
      next();
    } catch (error) {
      logger.warn(
        `${AUTH_MESSAGES.TOKEN_VERIFICATION_FAILED}: ${error instanceof Error ? error.message : ERROR_MESSAGES.SOMETHING_WENT_WRONG}`
      );
      ResponseUtils.unauthorized(
        res,
        AUTH_MESSAGES.TOKEN_INVALID,
        ErrorCodes.INVALID_TOKEN
      );
    }
  } catch (error) {
    logger.error(
      `${AUTH_MESSAGES.AUTHENTICATION_ERROR_DETAIL}: ${error instanceof Error ? error.message : ERROR_MESSAGES.SOMETHING_WENT_WRONG}`
    );
    ResponseUtils.internalError(
      res,
      AUTH_MESSAGES.AUTHENTICATION_ERROR_DETAIL,
      error instanceof Error ? error.message : undefined
    );
  }
};

export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      ResponseUtils.unauthorized(
        res,
        AUTH_MESSAGES.TOKEN_MISSING,
        ErrorCodes.INVALID_TOKEN
      );
      return;
    }

    if (!roles.includes(req.user.role)) {
      ResponseUtils.forbidden(
        res,
        AUTH_MESSAGES.INSUFFICIENT_PERMISSIONS,
        ErrorCodes.INSUFFICIENT_PERMISSIONS
      );
      return;
    }

    next();
  };
};

export const requireVerifiedUser = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    ResponseUtils.unauthorized(
      res,
      AUTH_MESSAGES.TOKEN_MISSING,
      ErrorCodes.INVALID_TOKEN
    );
    return;
  }

  // This would typically check against the user document in the database
  // For now, we'll assume the user is verified if they have a valid token
  // In a real implementation, you might want to check the user's verification status
  next();
};

export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return next();
    }

    try {
      const payload = verifyAccessToken(token) as TokenPayload;
      const sessionValidation = await authService.validateSession(
        payload.sessionId
      );

      if (sessionValidation.isValid) {
        req.user = {
          userId: payload.userId,
          email: payload.email,
          role: payload.role,
          sessionId: payload.sessionId,
        };
      }
    } catch (error) {
      // Silently ignore token errors for optional auth
      logger.debug(
        `${AUTH_MESSAGES.OPTIONAL_AUTH_TOKEN_VERIFICATION_FAILED}: ${error instanceof Error ? error.message : ERROR_MESSAGES.SOMETHING_WENT_WRONG}`
      );
    }

    next();
  } catch (error) {
    logger.error(
      `${AUTH_MESSAGES.OPTIONAL_AUTH_ERROR}: ${error instanceof Error ? error.message : ERROR_MESSAGES.SOMETHING_WENT_WRONG}`
    );
    next();
  }
};
