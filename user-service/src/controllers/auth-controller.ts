import { Request, Response } from "express";
import { 
  LoginRequest, 
  RegisterRequest, 
  RefreshTokenRequest, 
  AuthResponse 
} from "../types";
import {
  authService,
  LogoutRequest,
} from "../services/auth-service";
import { userService } from "../services/user-service";
import { ResponseUtils, ErrorCodes } from "../utils/response";
import { HTTP_STATUS } from "../utils/constants";
import {
  AUTH_MESSAGES,
  USER_MESSAGES,
  VALIDATION_MESSAGES,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
} from "../utils/messages";
import { logger } from "../config/logger-config";

export const authController = {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const userData: RegisterRequest = req.body;

      // Validate required fields
      if (
        !userData.email ||
        !userData.password ||
        !userData.firstName ||
        !userData.lastName
      ) {
        ResponseUtils.validationError(
          res,
          VALIDATION_MESSAGES.MISSING_REQUIRED_FIELDS_AUTH,
          VALIDATION_MESSAGES.MISSING_REQUIRED_FIELDS
        );
        return;
      }

      const result = await authService.register(userData);

      ResponseUtils.created(
        res,
        result,
        SUCCESS_MESSAGES.REGISTRATION_SUCCESSFUL
      );
    } catch (error) {
      logger.error(
        `${ERROR_MESSAGES.REGISTRATION_FAILED}: ${error instanceof Error ? error.message : ERROR_MESSAGES.SOMETHING_WENT_WRONG}`
      );

      const errorMessage =
        error instanceof Error
          ? error.message
          : ERROR_MESSAGES.REGISTRATION_FAILED;

      if (errorMessage.includes(VALIDATION_MESSAGES.ALREADY_EXISTS_MESSAGE)) {
        ResponseUtils.conflict(res, errorMessage);
      } else if (
        errorMessage.includes(VALIDATION_MESSAGES.PASSWORD_DOES_NOT_MEET)
      ) {
        ResponseUtils.validationError(
          res,
          errorMessage,
          VALIDATION_MESSAGES.PASSWORD_MUST_MEET_SECURITY_REQUIREMENTS
        );
      } else {
        ResponseUtils.internalError(
          res,
          ERROR_MESSAGES.REGISTRATION_FAILED,
          errorMessage
        );
      }
    }
  },

  async login(req: Request, res: Response): Promise<void> {
    try {
      const loginData: LoginRequest = req.body;

      // Validate required fields
      if (!loginData.email || !loginData.password) {
        ResponseUtils.validationError(
          res,
          VALIDATION_MESSAGES.MISSING_REQUIRED_FIELDS_LOGIN,
          VALIDATION_MESSAGES.BOTH_EMAIL_AND_PASSWORD_REQUIRED
        );
        return;
      }

      const result = await authService.login(loginData, req);

      ResponseUtils.success(res, result, SUCCESS_MESSAGES.LOGIN_SUCCESSFUL);
    } catch (error) {
      logger.error(
        `${ERROR_MESSAGES.LOGIN_FAILED}: ${error instanceof Error ? error.message : ERROR_MESSAGES.SOMETHING_WENT_WRONG}`
      );

      const errorMessage =
        error instanceof Error ? error.message : ERROR_MESSAGES.LOGIN_FAILED;

      if (errorMessage.includes(AUTH_MESSAGES.INVALID_CREDENTIALS)) {
        ResponseUtils.invalidCredentials(res, errorMessage);
      } else if (
        errorMessage.includes(AUTH_MESSAGES.ACCOUNT_TEMPORARILY_LOCKED)
      ) {
        ResponseUtils.accountLocked(res, errorMessage);
      } else if (errorMessage.includes(AUTH_MESSAGES.USER_INACTIVE)) {
        ResponseUtils.userInactive(res, errorMessage);
      } else if (errorMessage.includes(AUTH_MESSAGES.USER_UNVERIFIED)) {
        ResponseUtils.userUnverified(res, errorMessage);
      } else {
        ResponseUtils.internalError(
          res,
          ERROR_MESSAGES.LOGIN_FAILED,
          errorMessage
        );
      }
    }
  },

  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const refreshData: RefreshTokenRequest = req.body;

      // Validate required fields
      if (!refreshData.refreshToken) {
        ResponseUtils.validationError(
          res,
          AUTH_MESSAGES.MISSING_REFRESH_TOKEN,
          AUTH_MESSAGES.MISSING_REFRESH_TOKEN
        );
        return;
      }

      const result = await authService.refreshToken(refreshData);

      ResponseUtils.success(res, result, SUCCESS_MESSAGES.TOKEN_REFRESHED);
    } catch (error) {
      logger.error(
        `${ERROR_MESSAGES.TOKEN_REFRESH_FAILED}: ${error instanceof Error ? error.message : ERROR_MESSAGES.SOMETHING_WENT_WRONG}`
      );

      const errorMessage =
        error instanceof Error
          ? error.message
          : ERROR_MESSAGES.TOKEN_REFRESH_FAILED;

      if (
        errorMessage.includes(AUTH_MESSAGES.REFRESH_TOKEN_INVALID) ||
        errorMessage.includes(AUTH_MESSAGES.REFRESH_TOKEN_EXPIRED)
      ) {
        ResponseUtils.unauthorized(res, errorMessage, ErrorCodes.INVALID_TOKEN);
      } else if (errorMessage.includes(AUTH_MESSAGES.SESSION_EXPIRED)) {
        ResponseUtils.unauthorized(res, errorMessage, ErrorCodes.SESSION_EXPIRED);
      } else {
        ResponseUtils.internalError(
          res,
          ERROR_MESSAGES.TOKEN_REFRESH_FAILED,
          errorMessage
        );
      }
    }
  },

  async logout(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res, AUTH_MESSAGES.NOT_AUTHENTICATED);
        return;
      }

      const logoutData: LogoutRequest = {
        sessionId: req.user.sessionId,
      };

      await authService.logout(logoutData);

      ResponseUtils.success(res, null, SUCCESS_MESSAGES.LOGOUT_SUCCESSFUL);
    } catch (error) {
      logger.error(
        `${ERROR_MESSAGES.LOGOUT_FAILED}: ${error instanceof Error ? error.message : ERROR_MESSAGES.SOMETHING_WENT_WRONG}`
      );

      ResponseUtils.internalError(
        res,
        ERROR_MESSAGES.LOGOUT_FAILED,
        error instanceof Error ? error.message : undefined
      );
    }
  },

  async logoutAll(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res, AUTH_MESSAGES.NOT_AUTHENTICATED);
        return;
      }

      await authService.logoutAllSessions(req.user.userId);

      ResponseUtils.success(
        res,
        null,
        SUCCESS_MESSAGES.LOGOUT_ALL_SUCCESS_CODE
      );
    } catch (error) {
      logger.error(
        `${ERROR_MESSAGES.LOGOUT_ALL_FAILED}: ${error instanceof Error ? error.message : ERROR_MESSAGES.SOMETHING_WENT_WRONG}`
      );

      ResponseUtils.internalError(
        res,
        ERROR_MESSAGES.LOGOUT_ALL_FAILED,
        error instanceof Error ? error.message : undefined
      );
    }
  },

  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res, AUTH_MESSAGES.NOT_AUTHENTICATED);
        return;
      }

      const user = await userService.getUserById(req.user.userId);

      ResponseUtils.success(res, user, USER_MESSAGES.PROFILE_RETRIEVED);
    } catch (error) {
      logger.error(
        `${ERROR_MESSAGES.OPERATION_FAILED}: ${error instanceof Error ? error.message : ERROR_MESSAGES.SOMETHING_WENT_WRONG}`
      );

      ResponseUtils.internalError(
        res,
        ERROR_MESSAGES.OPERATION_FAILED,
        error instanceof Error ? error.message : undefined
      );
    }
  },
};
