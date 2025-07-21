// ============================================================================
// CENTRALIZED MESSAGE UTILITIES
// ============================================================================

// ============================================================================
// AUTHENTICATION MESSAGES
// ============================================================================

export const AUTH_MESSAGES = {
  // Login & Registration
  INVALID_CREDENTIALS: "Invalid email or password",
  EMAIL_ALREADY_EXISTS: "Email already registered",
  PASSWORD_TOO_WEAK: "Password does not meet security requirements",
  USER_NOT_FOUND: "User not found",
  USER_INACTIVE: "User account is inactive",
  USER_UNVERIFIED: "User account is not verified",

  // Token Related
  TOKEN_EXPIRED: "Token has expired",
  TOKEN_INVALID: "Invalid token",
  TOKEN_MISSING: "Access token is required",
  REFRESH_TOKEN_INVALID: "Invalid refresh token",
  REFRESH_TOKEN_EXPIRED: "Refresh token has expired",
  MISSING_REFRESH_TOKEN: "Missing required field: refreshToken",

  // Session Related
  SESSION_EXPIRED: "Session has expired",
  TOO_MANY_SESSIONS: "Maximum number of active sessions reached",

  // General Auth
  NOT_AUTHENTICATED: "User not authenticated",
  INSUFFICIENT_PERMISSIONS: "Insufficient permissions",
  UNAUTHORIZED_ACCESS: "Unauthorized access",
  ACCESS_FORBIDDEN: "Access forbidden",

  // Auth Error Details
  AUTHENTICATION_ERROR_DETAIL: "Internal server error during authentication",
  TOKEN_VERIFICATION_FAILED: "Token verification failed",
  OPTIONAL_AUTH_ERROR: "Optional auth middleware error",
  OPTIONAL_AUTH_TOKEN_VERIFICATION_FAILED:
    "Optional auth token verification failed",

  // Auth Operations
  REGISTRATION_ERROR: "Registration error",
  LOGIN_ERROR: "Login error",
  TOKEN_REFRESH_ERROR: "Token refresh error",
  LOGOUT_ERROR: "Logout error",
  LOGOUT_ALL_ERROR: "Logout all sessions error",

  // Auth Status
  ACCOUNT_TEMPORARILY_LOCKED: "Account temporarily locked",
  USER_ACCOUNT_IS_INACTIVE: "User account is inactive",
  USER_ACCOUNT_IS_NOT_VERIFIED: "User account is not verified",
} as const;

// ============================================================================
// USER MESSAGES
// ============================================================================

export const USER_MESSAGES = {
  // Profile Operations
  PROFILE_RETRIEVED: "Profile retrieved successfully",
  PROFILE_UPDATED: "Profile updated successfully",
  PROFILE_DELETED: "Profile deleted successfully",
  PROFILE_NOT_FOUND: "User profile not found",

  // User Management
  USER_CREATED: "User created successfully",
  USER_UPDATED: "User updated successfully",
  USER_DELETED: "User deleted successfully",
  USER_RETRIEVED: "User retrieved successfully",
  USERS_RETRIEVED: "Users retrieved successfully",

  // User Status
  USER_ACTIVATED: "User account activated",
  USER_DEACTIVATED: "User account deactivated",
  USER_VERIFIED: "User account verified",

  // User Operations
  GET_PROFILE_ERROR: "Get profile error",
  UPDATE_PROFILE_ERROR: "Update profile error",
  DELETE_PROFILE_ERROR: "Delete profile error",
  GET_ALL_USERS_ERROR: "Get all users error",
  GET_USER_BY_ID_ERROR: "Get user by ID error",
  UPDATE_USER_ERROR: "Update user error",
  DELETE_USER_ERROR: "Delete user error",

  // User Errors
  USER_UPDATE_FAILED: "Failed to update user",
  USER_DELETE_FAILED: "Failed to delete user",
  USER_RETRIEVAL_FAILED: "Failed to retrieve user",
  USERS_RETRIEVAL_FAILED: "Failed to retrieve users",
  FAILED_TO_RETRIEVE_PROFILE: "Failed to retrieve profile",
  FAILED_TO_UPDATE_PROFILE: "Failed to update profile",
  FAILED_TO_DELETE_PROFILE: "Failed to delete profile",
  FAILED_TO_RETRIEVE_USERS: "Failed to retrieve users",
  FAILED_TO_RETRIEVE_USER: "Failed to retrieve user",
  FAILED_TO_UPDATE_USER: "Failed to update user",
  FAILED_TO_DELETE_USER: "Failed to delete user",

  // User Success
  USER_UPDATED_SUCCESS: "User updated successfully",
  USER_DELETED_SUCCESS: "User deleted successfully",
  PROFILE_UPDATED_SUCCESS: "Profile updated successfully",
  PROFILE_DELETED_SUCCESS: "Profile deleted successfully",

  // User Defaults
  REGISTRATION_DEVICE: "Registration",
  REGISTRATION_IP: "Registration",
  REGISTRATION_USER_AGENT: "Registration",

  // Admin
  ADMIN_ENDPOINT_PLACEHOLDER:
    "Admin users endpoint - implement user listing logic here",
} as const;

// ============================================================================
// VALIDATION MESSAGES
// ============================================================================

export const VALIDATION_MESSAGES = {
  // Required Fields
  MISSING_REQUIRED_FIELDS: "Missing required fields",
  EMAIL_REQUIRED: "Email is required",
  PASSWORD_REQUIRED: "Password is required",
  FIRST_NAME_REQUIRED: "First name is required",
  LAST_NAME_REQUIRED: "Last name is required",
  MISSING_REQUIRED_FIELDS_AUTH:
    "Missing required fields: email, password, firstName, lastName",
  MISSING_REQUIRED_FIELDS_LOGIN: "Missing required fields: email, password",
  BOTH_EMAIL_AND_PASSWORD_REQUIRED: "Both email and password are required",

  // Format Validation
  INVALID_EMAIL_FORMAT: "Invalid email format",
  INVALID_PASSWORD_FORMAT: "Invalid password format",
  INVALID_PHONE_FORMAT: "Invalid phone number format",
  INVALID_DATE_FORMAT: "Invalid date format",

  // Length Validation
  EMAIL_TOO_LONG: "Email address is too long",
  PASSWORD_TOO_SHORT: "Password is too short",
  PASSWORD_TOO_LONG: "Password is too long",
  NAME_TOO_LONG: "Name is too long",

  // Content Validation
  PASSWORD_MUST_CONTAIN_UPPERCASE:
    "Password must contain at least one uppercase letter",
  PASSWORD_MUST_CONTAIN_LOWERCASE:
    "Password must contain at least one lowercase letter",
  PASSWORD_MUST_CONTAIN_NUMBER: "Password must contain at least one number",
  PASSWORD_MUST_CONTAIN_SPECIAL:
    "Password must contain at least one special character",
  PASSWORD_MUST_MEET_SECURITY_REQUIREMENTS:
    "Password must meet security requirements",

  // General Validation
  INVALID_INPUT: "Invalid input provided",
  INVALID_FORMAT: "Invalid format",
  FIELD_TOO_SHORT: "Field is too short",
  FIELD_TOO_LONG: "Field is too long",
  ALREADY_EXISTS_MESSAGE: "already exists",
  PASSWORD_DOES_NOT_MEET: "Password does not meet",
} as const;

// ============================================================================
// SUCCESS MESSAGES
// ============================================================================

export const SUCCESS_MESSAGES = {
  // General Success
  OPERATION_SUCCESSFUL: "Operation completed successfully",
  DATA_RETRIEVED: "Data retrieved successfully",
  DATA_CREATED: "Data created successfully",
  DATA_UPDATED: "Data updated successfully",
  DATA_DELETED: "Data deleted successfully",

  // Authentication Success
  LOGIN_SUCCESSFUL: "Login successful",
  LOGOUT_SUCCESSFUL: "Logout successful",
  REGISTRATION_SUCCESSFUL: "User registered successfully",
  TOKEN_REFRESHED: "Token refreshed successfully",
  TOKEN_REFRESHED_SUCCESS: "Token refreshed successfully",
  LOGOUT_SUCCESS_CODE: "Logout successful",
  LOGOUT_ALL_SUCCESS_CODE: "All sessions logged out successfully",

  // Service Status
  SERVICE_RUNNING: "Service is running",
  API_LIVE: "API is live",
  HEALTHY: "Service is healthy",
} as const;

// ============================================================================
// ERROR MESSAGES
// ============================================================================

export const ERROR_MESSAGES = {
  // General Errors
  INTERNAL_SERVER_ERROR: "Internal server error",
  SOMETHING_WENT_WRONG: "Something went wrong",
  OPERATION_FAILED: "Operation failed",
  REQUEST_FAILED: "Request failed",

  // Database Errors
  DATABASE_ERROR: "Database operation failed",
  DATABASE_CONNECTION_ERROR: "Database connection failed",
  DATA_NOT_FOUND: "Data not found",
  DATA_ALREADY_EXISTS: "Data already exists",

  // Network Errors
  NETWORK_ERROR: "Network error occurred",
  TIMEOUT_ERROR: "Request timeout",
  CONNECTION_ERROR: "Connection error",

  // External Service Errors
  EXTERNAL_SERVICE_ERROR: "External service error",
  SERVICE_UNAVAILABLE: "Service unavailable",
  THIRD_PARTY_ERROR: "Third-party service error",

  // Configuration Errors
  CONFIGURATION_ERROR: "Configuration error",
  MISSING_CONFIGURATION: "Missing configuration",
  INVALID_CONFIGURATION: "Invalid configuration",

  // Auth Errors
  REGISTRATION_FAILED: "Registration failed",
  LOGIN_FAILED: "Login failed",
  TOKEN_REFRESH_FAILED: "Token refresh failed",
  LOGOUT_FAILED: "Logout failed",
  LOGOUT_ALL_FAILED: "Logout all sessions failed",

  // Error Codes
  MISSING_REFRESH_TOKEN_CODE: "MISSING_REFRESH_TOKEN",
  INVALID_REFRESH_TOKEN_CODE: "INVALID_REFRESH_TOKEN",
  SESSION_EXPIRED_CODE: "SESSION_EXPIRED",
  REFRESH_ERROR_CODE: "REFRESH_ERROR",
  LOGOUT_ERROR_CODE: "LOGOUT_ERROR",
  LOGOUT_ALL_ERROR_CODE: "LOGOUT_ALL_ERROR",
  PROFILE_ERROR_CODE: "PROFILE_ERROR",
  USER_NOT_FOUND_CODE: "USER_NOT_FOUND",
  USERS_ERROR_CODE: "USERS_ERROR",
  USER_ERROR_CODE: "USER_ERROR",
  UPDATE_ERROR_CODE: "UPDATE_ERROR",
  DELETE_ERROR_CODE: "DELETE_ERROR",
} as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get message by category and key
 */
export const getMessage = (category: string, key: string): string => {
  const messageCategories = {
    AUTH: AUTH_MESSAGES,
    USER: USER_MESSAGES,
    VALIDATION: VALIDATION_MESSAGES,
    SUCCESS: SUCCESS_MESSAGES,
    ERROR: ERROR_MESSAGES,
  };

  const categoryMessages =
    messageCategories[category as keyof typeof messageCategories];
  if (!categoryMessages) {
    throw new Error(`Unknown message category: ${category}`);
  }

  const message = categoryMessages[key as keyof typeof categoryMessages];
  if (!message) {
    throw new Error(`Unknown message key: ${key} in category: ${category}`);
  }

  return message;
};

/**
 * Get auth message by key
 */
export const getAuthMessage = (key: keyof typeof AUTH_MESSAGES): string => {
  return AUTH_MESSAGES[key];
};

/**
 * Get user message by key
 */
export const getUserMessage = (key: keyof typeof USER_MESSAGES): string => {
  return USER_MESSAGES[key];
};

/**
 * Get validation message by key
 */
export const getValidationMessage = (
  key: keyof typeof VALIDATION_MESSAGES
): string => {
  return VALIDATION_MESSAGES[key];
};

/**
 * Get success message by key
 */
export const getSuccessMessage = (
  key: keyof typeof SUCCESS_MESSAGES
): string => {
  return SUCCESS_MESSAGES[key];
};

/**
 * Get error message by key
 */
export const getErrorMessage = (key: keyof typeof ERROR_MESSAGES): string => {
  return ERROR_MESSAGES[key];
};
