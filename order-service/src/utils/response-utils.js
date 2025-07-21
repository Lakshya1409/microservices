// ============================================================================
// RESPONSE UTILITIES FOR ORDER SERVICE
// ============================================================================

const API_VERSION = process.env.API_VERSION || "1.0.0";

// ============================================================================
// ERROR CODES
// ============================================================================

const ErrorCodes = {
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
};

// ============================================================================
// RESPONSE UTILITY CLASS
// ============================================================================

class ResponseUtils {
  /**
   * Send a successful response
   */
  static success(
    res,
    data,
    message = "Operation completed successfully",
    statusCode = 200,
    pagination = null
  ) {
    const response = {
      success: true,
      message,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        version: API_VERSION,
      },
    };

    if (pagination) {
      response.meta.pagination = {
        page: pagination.page || 1,
        limit: pagination.limit || 10,
        total: pagination.total || 0,
        totalPages: pagination.total
          ? Math.ceil(pagination.total / (pagination.limit || 10))
          : 0,
      };
    }

    res.status(statusCode).json(response);
  }

  /**
   * Send an error response
   */
  static error(
    res,
    message,
    errorCode,
    statusCode = 400,
    details = null,
    field = null
  ) {
    const response = {
      success: false,
      message,
      error: {
        code: errorCode,
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: API_VERSION,
      },
    };

    if (details) response.error.details = details;
    if (field) response.error.field = field;

    res.status(statusCode).json(response);
  }

  /**
   * Send a created response (201)
   */
  static created(res, data, message = "Resource created successfully") {
    this.success(res, data, message, 201);
  }

  /**
   * Send a no content response (204)
   */
  static noContent(res) {
    res.status(204).send();
  }

  /**
   * Send a paginated response
   */
  static paginated(
    res,
    data,
    pagination,
    message = "Data retrieved successfully"
  ) {
    this.success(res, data, message, 200, pagination);
  }

  // ============================================================================
  // COMMON ERROR RESPONSES
  // ============================================================================

  /**
   * Send unauthorized error response
   */
  static unauthorized(
    res,
    message = "Unauthorized access",
    errorCode = ErrorCodes.UNAUTHORIZED
  ) {
    this.error(res, message, errorCode, 401);
  }

  /**
   * Send forbidden error response
   */
  static forbidden(
    res,
    message = "Access forbidden",
    errorCode = ErrorCodes.FORBIDDEN
  ) {
    this.error(res, message, errorCode, 403);
  }

  /**
   * Send not found error response
   */
  static notFound(
    res,
    message = "Resource not found",
    errorCode = ErrorCodes.RESOURCE_NOT_FOUND
  ) {
    this.error(res, message, errorCode, 404);
  }

  /**
   * Send validation error response
   */
  static validationError(
    res,
    message = "Validation failed",
    details = null,
    field = null
  ) {
    this.error(res, message, ErrorCodes.VALIDATION_ERROR, 400, details, field);
  }

  /**
   * Send conflict error response
   */
  static conflict(
    res,
    message = "Resource conflict",
    errorCode = ErrorCodes.RESOURCE_CONFLICT
  ) {
    this.error(res, message, errorCode, 409);
  }

  /**
   * Send rate limit error response
   */
  static rateLimitExceeded(res, message = "Rate limit exceeded") {
    this.error(res, message, ErrorCodes.RATE_LIMIT_EXCEEDED, 429);
  }

  /**
   * Send internal server error response
   */
  static internalError(res, message = "Internal server error", details = null) {
    this.error(res, message, ErrorCodes.INTERNAL_SERVER_ERROR, 500, details);
  }

  /**
   * Send database error response
   */
  static databaseError(
    res,
    message = "Database operation failed",
    details = null
  ) {
    this.error(res, message, ErrorCodes.DATABASE_ERROR, 500, details);
  }

  // ============================================================================
  // BUSINESS LOGIC SPECIFIC RESPONSES
  // ============================================================================

  /**
   * Send order not found error
   */
  static orderNotFound(res, message = "Order not found") {
    this.error(res, message, ErrorCodes.ORDER_NOT_FOUND, 404);
  }

  /**
   * Send product not found error
   */
  static productNotFound(res, message = "Product not found") {
    this.error(res, message, ErrorCodes.PRODUCT_NOT_FOUND, 404);
  }

  /**
   * Send product out of stock error
   */
  static productOutOfStock(res, message = "Product is out of stock") {
    this.error(res, message, ErrorCodes.PRODUCT_OUT_OF_STOCK, 400);
  }

  /**
   * Send insufficient balance error
   */
  static insufficientBalance(res, message = "Insufficient balance") {
    this.error(res, message, ErrorCodes.INSUFFICIENT_BALANCE, 400);
  }

  /**
   * Send invalid operation error
   */
  static invalidOperation(res, message = "Invalid operation") {
    this.error(res, message, ErrorCodes.INVALID_OPERATION, 400);
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
export const sendOrderNotFound =
  ResponseUtils.orderNotFound.bind(ResponseUtils);
export const sendProductNotFound =
  ResponseUtils.productNotFound.bind(ResponseUtils);
export const sendProductOutOfStock =
  ResponseUtils.productOutOfStock.bind(ResponseUtils);
export const sendInsufficientBalance =
  ResponseUtils.insufficientBalance.bind(ResponseUtils);
export const sendInvalidOperation =
  ResponseUtils.invalidOperation.bind(ResponseUtils);

export { ResponseUtils, ErrorCodes };
