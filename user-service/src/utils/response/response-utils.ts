import { Response } from "express";
import { HTTP_STATUS } from "../constants";
import {
  AUTH_MESSAGES,
  VALIDATION_MESSAGES,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
} from "../messages";

// ============================================================================
// RESPONSE INTERFACES
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: string;
    details?: string;
    field?: string;
  };
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    timestamp: string;
    version?: string;
  };
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  total?: number;
}

export interface ErrorResponse {
  success: false;
  message: string;
  error: {
    code: string;
    details?: string;
    field?: string;
  };
  meta: {
    timestamp: string;
    version?: string;
  };
}

export interface SuccessResponse<T = any> {
  success: true;
  message: string;
  data?: T;
  meta: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    timestamp: string;
    version?: string;
  };
}

// ============================================================================
// ERROR CODES
// ============================================================================

export const ErrorCodes = {
  // Authentication & Authorization
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  TOKEN_EXPIRED: "TOKEN_EXPIRED",
  INVALID_TOKEN: "INVALID_TOKEN",
  SESSION_EXPIRED: "SESSION_EXPIRED",
  ACCOUNT_LOCKED: "ACCOUNT_LOCKED",
  USER_INACTIVE: "USER_INACTIVE",
  USER_UNVERIFIED: "USER_UNVERIFIED",
  NOT_AUTHENTICATED: "NOT_AUTHENTICATED",
  INSUFFICIENT_PERMISSIONS: "INSUFFICIENT_PERMISSIONS",

  // Validation
  VALIDATION_ERROR: "VALIDATION_ERROR",
  MISSING_REQUIRED_FIELDS: "MISSING_REQUIRED_FIELDS",
  INVALID_FORMAT: "INVALID_FORMAT",
  PASSWORD_TOO_WEAK: "PASSWORD_TOO_WEAK",
  EMAIL_ALREADY_EXISTS: "EMAIL_ALREADY_EXISTS",
  USER_NOT_FOUND: "USER_NOT_FOUND",

  // Resource Management
  RESOURCE_NOT_FOUND: "RESOURCE_NOT_FOUND",
  RESOURCE_ALREADY_EXISTS: "RESOURCE_ALREADY_EXISTS",
  RESOURCE_CONFLICT: "RESOURCE_CONFLICT",
  RESOURCE_DELETED: "RESOURCE_DELETED",

  // Rate Limiting
  RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED",
  TOO_MANY_REQUESTS: "TOO_MANY_REQUESTS",

  // Server Errors
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
  DATABASE_ERROR: "DATABASE_ERROR",
  EXTERNAL_SERVICE_ERROR: "EXTERNAL_SERVICE_ERROR",
  CONFIGURATION_ERROR: "CONFIGURATION_ERROR",

  // Business Logic
  INVALID_OPERATION: "INVALID_OPERATION",
  OPERATION_FAILED: "OPERATION_FAILED",
  INSUFFICIENT_BALANCE: "INSUFFICIENT_BALANCE",
  ORDER_NOT_FOUND: "ORDER_NOT_FOUND",
  PRODUCT_NOT_FOUND: "PRODUCT_NOT_FOUND",
  PRODUCT_OUT_OF_STOCK: "PRODUCT_OUT_OF_STOCK",
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

// ============================================================================
// RESPONSE UTILITY CLASS
// ============================================================================

export class ResponseUtils {
  private static readonly API_VERSION = process.env.API_VERSION || "1.0.0";

  /**
   * Send a successful response
   */
  static success<T>(
    res: Response,
    data: T,
    message: string = SUCCESS_MESSAGES.OPERATION_SUCCESSFUL,
    statusCode: number = HTTP_STATUS.OK,
    pagination?: PaginationOptions
  ): void {
    const response: SuccessResponse<T> = {
      success: true,
      message,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        version: this.API_VERSION,
        ...(pagination && {
          pagination: {
            page: pagination.page || 1,
            limit: pagination.limit || 10,
            total: pagination.total || 0,
            totalPages: pagination.total
              ? Math.ceil(pagination.total / (pagination.limit || 10))
              : 0,
          },
        }),
      },
    };

    res.status(statusCode).json(response);
  }

  /**
   * Send an error response
   */
  static error(
    res: Response,
    message: string,
    errorCode: ErrorCode,
    statusCode: number = HTTP_STATUS.BAD_REQUEST,
    details?: string,
    field?: string
  ): void {
    const response: ErrorResponse = {
      success: false,
      message,
      error: {
        code: errorCode,
        details,
        field,
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: this.API_VERSION,
      },
    };

    res.status(statusCode).json(response);
  }

  /**
   * Send a created response (201)
   */
  static created<T>(
    res: Response,
    data: T,
    message: string = SUCCESS_MESSAGES.DATA_CREATED
  ): void {
    this.success(res, data, message, HTTP_STATUS.CREATED);
  }

  /**
   * Send a no content response (204)
   */
  static noContent(res: Response): void {
    res.status(HTTP_STATUS.NO_CONTENT).send();
  }

  /**
   * Send a paginated response
   */
  static paginated<T>(
    res: Response,
    data: T[],
    pagination: Required<PaginationOptions>,
    message: string = SUCCESS_MESSAGES.DATA_RETRIEVED
  ): void {
    this.success(res, data, message, HTTP_STATUS.OK, pagination);
  }

  // ============================================================================
  // COMMON ERROR RESPONSES
  // ============================================================================

  /**
   * Send unauthorized error response
   */
  static unauthorized(
    res: Response,
    message: string = AUTH_MESSAGES.UNAUTHORIZED_ACCESS,
    errorCode: ErrorCode = ErrorCodes.UNAUTHORIZED
  ): void {
    this.error(res, message, errorCode, HTTP_STATUS.UNAUTHORIZED);
  }

  /**
   * Send forbidden error response
   */
  static forbidden(
    res: Response,
    message: string = AUTH_MESSAGES.ACCESS_FORBIDDEN,
    errorCode: ErrorCode = ErrorCodes.FORBIDDEN
  ): void {
    this.error(res, message, errorCode, HTTP_STATUS.FORBIDDEN);
  }

  /**
   * Send not found error response
   */
  static notFound(
    res: Response,
    message: string = ERROR_MESSAGES.DATA_NOT_FOUND,
    errorCode: ErrorCode = ErrorCodes.RESOURCE_NOT_FOUND
  ): void {
    this.error(res, message, errorCode, HTTP_STATUS.NOT_FOUND);
  }

  /**
   * Send validation error response
   */
  static validationError(
    res: Response,
    message: string = VALIDATION_MESSAGES.INVALID_INPUT,
    details?: string,
    field?: string
  ): void {
    this.error(
      res,
      message,
      ErrorCodes.VALIDATION_ERROR,
      HTTP_STATUS.BAD_REQUEST,
      details,
      field
    );
  }

  /**
   * Send conflict error response
   */
  static conflict(
    res: Response,
    message: string = ERROR_MESSAGES.DATA_ALREADY_EXISTS,
    errorCode: ErrorCode = ErrorCodes.RESOURCE_CONFLICT
  ): void {
    this.error(res, message, errorCode, HTTP_STATUS.CONFLICT);
  }

  /**
   * Send rate limit error response
   */
  static rateLimitExceeded(
    res: Response,
    message: string = "Rate limit exceeded"
  ): void {
    this.error(
      res,
      message,
      ErrorCodes.RATE_LIMIT_EXCEEDED,
      HTTP_STATUS.TOO_MANY_REQUESTS
    );
  }

  /**
   * Send internal server error response
   */
  static internalError(
    res: Response,
    message: string = ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    details?: string
  ): void {
    this.error(
      res,
      message,
      ErrorCodes.INTERNAL_SERVER_ERROR,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      details
    );
  }

  /**
   * Send database error response
   */
  static databaseError(
    res: Response,
    message: string = ERROR_MESSAGES.DATABASE_ERROR,
    details?: string
  ): void {
    this.error(
      res,
      message,
      ErrorCodes.DATABASE_ERROR,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      details
    );
  }

  // ============================================================================
  // AUTHENTICATION SPECIFIC RESPONSES
  // ============================================================================

  /**
   * Send invalid credentials error
   */
  static invalidCredentials(
    res: Response,
    message: string = AUTH_MESSAGES.INVALID_CREDENTIALS
  ): void {
    this.error(
      res,
      message,
      ErrorCodes.INVALID_CREDENTIALS,
      HTTP_STATUS.UNAUTHORIZED
    );
  }

  /**
   * Send token expired error
   */
  static tokenExpired(
    res: Response,
    message: string = AUTH_MESSAGES.TOKEN_EXPIRED
  ): void {
    this.error(
      res,
      message,
      ErrorCodes.TOKEN_EXPIRED,
      HTTP_STATUS.UNAUTHORIZED
    );
  }

  /**
   * Send account locked error
   */
  static accountLocked(
    res: Response,
    message: string = AUTH_MESSAGES.ACCOUNT_TEMPORARILY_LOCKED
  ): void {
    this.error(
      res,
      message,
      ErrorCodes.ACCOUNT_LOCKED,
      HTTP_STATUS.TOO_MANY_REQUESTS
    );
  }

  /**
   * Send user inactive error
   */
  static userInactive(
    res: Response,
    message: string = AUTH_MESSAGES.USER_INACTIVE
  ): void {
    this.error(res, message, ErrorCodes.USER_INACTIVE, HTTP_STATUS.FORBIDDEN);
  }

  /**
   * Send user unverified error
   */
  static userUnverified(
    res: Response,
    message: string = AUTH_MESSAGES.USER_UNVERIFIED
  ): void {
    this.error(res, message, ErrorCodes.USER_UNVERIFIED, HTTP_STATUS.FORBIDDEN);
  }

  // ============================================================================
  // BUSINESS LOGIC SPECIFIC RESPONSES
  // ============================================================================

  /**
   * Send insufficient balance error
   */
  static insufficientBalance(
    res: Response,
    message: string = "Insufficient balance"
  ): void {
    this.error(
      res,
      message,
      ErrorCodes.INSUFFICIENT_BALANCE,
      HTTP_STATUS.BAD_REQUEST
    );
  }

  /**
   * Send product out of stock error
   */
  static productOutOfStock(
    res: Response,
    message: string = "Product is out of stock"
  ): void {
    this.error(
      res,
      message,
      ErrorCodes.PRODUCT_OUT_OF_STOCK,
      HTTP_STATUS.BAD_REQUEST
    );
  }

  /**
   * Send order not found error
   */
  static orderNotFound(
    res: Response,
    message: string = "Order not found"
  ): void {
    this.error(res, message, ErrorCodes.ORDER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  /**
   * Send product not found error
   */
  static productNotFound(
    res: Response,
    message: string = "Product not found"
  ): void {
    this.error(
      res,
      message,
      ErrorCodes.PRODUCT_NOT_FOUND,
      HTTP_STATUS.NOT_FOUND
    );
  }
}

// ============================================================================
// CONVENIENCE FUNCTIONS (for backward compatibility)
// ============================================================================

export const sendSuccess = ResponseUtils.success.bind(ResponseUtils);
export const sendError = ResponseUtils.error.bind(ResponseUtils);
export const sendCreated = ResponseUtils.created.bind(ResponseUtils);
export const sendNoContent = ResponseUtils.noContent.bind(ResponseUtils);
export const sendPaginated = ResponseUtils.paginated.bind(ResponseUtils);
export const sendUnauthorized = ResponseUtils.unauthorized.bind(ResponseUtils);
export const sendForbidden = ResponseUtils.forbidden.bind(ResponseUtils);
export const sendNotFound = ResponseUtils.notFound.bind(ResponseUtils);
export const sendValidationError =
  ResponseUtils.validationError.bind(ResponseUtils);
export const sendConflict = ResponseUtils.conflict.bind(ResponseUtils);
export const sendRateLimitExceeded =
  ResponseUtils.rateLimitExceeded.bind(ResponseUtils);
export const sendInternalError =
  ResponseUtils.internalError.bind(ResponseUtils);
export const sendDatabaseError =
  ResponseUtils.databaseError.bind(ResponseUtils);
export const sendInvalidCredentials =
  ResponseUtils.invalidCredentials.bind(ResponseUtils);
export const sendTokenExpired = ResponseUtils.tokenExpired.bind(ResponseUtils);
export const sendAccountLocked =
  ResponseUtils.accountLocked.bind(ResponseUtils);
export const sendUserInactive = ResponseUtils.userInactive.bind(ResponseUtils);
export const sendUserUnverified =
  ResponseUtils.userUnverified.bind(ResponseUtils);
export const sendInsufficientBalance =
  ResponseUtils.insufficientBalance.bind(ResponseUtils);
export const sendProductOutOfStock =
  ResponseUtils.productOutOfStock.bind(ResponseUtils);
export const sendOrderNotFound =
  ResponseUtils.orderNotFound.bind(ResponseUtils);
export const sendProductNotFound =
  ResponseUtils.productNotFound.bind(ResponseUtils);
