import { Request, Response } from "express";
import { userService } from "../services/user-service";
import { ResponseUtils, ErrorCodes } from "../utils/response";
import {
  AUTH_MESSAGES,
  USER_MESSAGES,
  ERROR_MESSAGES,
} from "../utils/messages";
import { logger } from "../config/logger-config";
import { IUser } from "../models/user-model";

export const userController = {
  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res, AUTH_MESSAGES.NOT_AUTHENTICATED);
        return;
      }

      logger.debug("getting profile");

      const user = await userService.getUserById(req.user.userId);
      if (!user) {
        ResponseUtils.notFound(
          res,
          AUTH_MESSAGES.USER_NOT_FOUND,
          ErrorCodes.USER_NOT_FOUND
        );
        return;
      }

      ResponseUtils.success(
        res,
        user.toUserResponse(),
        USER_MESSAGES.PROFILE_RETRIEVED
      );
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

  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res, AUTH_MESSAGES.NOT_AUTHENTICATED);
        return;
      }

      const updatedUser = await userService.updateUser(
        req.user.userId,
        req.body
      );

      ResponseUtils.success(
        res,
        updatedUser.toUserResponse(),
        USER_MESSAGES.PROFILE_UPDATED
      );
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

  async deleteProfile(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res, AUTH_MESSAGES.NOT_AUTHENTICATED);
        return;
      }

      await userService.deleteUser(req.user.userId);

      ResponseUtils.success(res, null, USER_MESSAGES.PROFILE_DELETED);
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

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await userService.getAllUsers();

      ResponseUtils.success(
        res,
        users.map((user: IUser) => user.toUserResponse()),
        USER_MESSAGES.USERS_RETRIEVED
      );
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

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const user = await userService.getUserById(userId);

      if (!user) {
        ResponseUtils.notFound(
          res,
          AUTH_MESSAGES.USER_NOT_FOUND,
          ErrorCodes.USER_NOT_FOUND
        );
        return;
      }

      ResponseUtils.success(
        res,
        user.toUserResponse(),
        USER_MESSAGES.USER_RETRIEVED
      );
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

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const updatedUser = await userService.updateUser(userId, req.body);

      ResponseUtils.success(
        res,
        updatedUser.toUserResponse(),
        USER_MESSAGES.USER_UPDATED
      );
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

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      await userService.deleteUser(userId);

      ResponseUtils.success(res, null, USER_MESSAGES.USER_DELETED);
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
