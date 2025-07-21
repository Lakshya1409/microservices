import { Response } from "express";

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

export interface RequestWithUser extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
    sessionId: string;
  };
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export type ErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "INVALID_CREDENTIALS"
  | "TOKEN_EXPIRED"
  | "INVALID_TOKEN"
  | "SESSION_EXPIRED"
  | "ACCOUNT_LOCKED"
  | "USER_INACTIVE"
  | "USER_UNVERIFIED"
  | "NOT_AUTHENTICATED"
  | "INSUFFICIENT_PERMISSIONS"
  | "VALIDATION_ERROR"
  | "MISSING_REQUIRED_FIELDS"
  | "INVALID_FORMAT"
  | "PASSWORD_TOO_WEAK"
  | "EMAIL_ALREADY_EXISTS"
  | "USER_NOT_FOUND"
  | "RESOURCE_NOT_FOUND"
  | "RESOURCE_ALREADY_EXISTS"
  | "RESOURCE_CONFLICT"
  | "RESOURCE_DELETED"
  | "RATE_LIMIT_EXCEEDED"
  | "TOO_MANY_REQUESTS"
  | "INTERNAL_SERVER_ERROR"
  | "DATABASE_ERROR"
  | "EXTERNAL_SERVICE_ERROR"
  | "CONFIGURATION_ERROR"
  | "INVALID_OPERATION"
  | "OPERATION_FAILED"
  | "INSUFFICIENT_BALANCE"
  | "ORDER_NOT_FOUND"
  | "PRODUCT_NOT_FOUND"
  | "PRODUCT_OUT_OF_STOCK";
