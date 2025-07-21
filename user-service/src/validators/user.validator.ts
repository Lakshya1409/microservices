import { Request, Response, NextFunction } from "express";
import { APP_CONSTANTS, GENDER_OPTIONS, USER_ROLES } from "../utils/constants";
import { ResponseUtils } from "../utils/response";
import { ValidationError } from "../types";

export const validateUserUpdate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { firstName, lastName, phone, dateOfBirth, gender } = req.body;

  const errors: ValidationError[] = [];

  // Name validation
  if (firstName !== undefined) {
    if (!firstName || firstName.trim().length === 0) {
      errors.push({
        field: "firstName",
        message: "First name cannot be empty",
        value: firstName,
      });
    } else if (firstName.length > APP_CONSTANTS.NAME_MAX_LENGTH) {
      errors.push({
        field: "firstName",
        message: `First name must be less than ${APP_CONSTANTS.NAME_MAX_LENGTH} characters`,
        value: firstName,
      });
    }
  }

  if (lastName !== undefined) {
    if (!lastName || lastName.trim().length === 0) {
      errors.push({
        field: "lastName",
        message: "Last name cannot be empty",
        value: lastName,
      });
    } else if (lastName.length > APP_CONSTANTS.NAME_MAX_LENGTH) {
      errors.push({
        field: "lastName",
        message: `Last name must be less than ${APP_CONSTANTS.NAME_MAX_LENGTH} characters`,
        value: lastName,
      });
    }
  }

  // Phone validation (optional)
  if (phone !== undefined) {
    if (phone && phone.length > APP_CONSTANTS.PHONE_MAX_LENGTH) {
      errors.push({
        field: "phone",
        message: `Phone number must be less than ${APP_CONSTANTS.PHONE_MAX_LENGTH} characters`,
        value: phone,
      });
    }
  }

  // Date of birth validation (optional)
  if (dateOfBirth !== undefined) {
    if (dateOfBirth) {
      const date = new Date(dateOfBirth);
      if (isNaN(date.getTime())) {
        errors.push({
          field: "dateOfBirth",
          message: "Invalid date format. Use YYYY-MM-DD",
          value: dateOfBirth,
        });
      } else if (date > new Date()) {
        errors.push({
          field: "dateOfBirth",
          message: "Date of birth cannot be in the future",
          value: dateOfBirth,
        });
      }
    }
  }

  // Gender validation (optional)
  if (gender !== undefined) {
    if (gender && !Object.values(GENDER_OPTIONS).includes(gender)) {
      errors.push({
        field: "gender",
        message: `Gender must be one of: ${Object.values(GENDER_OPTIONS).join(", ")}`,
        value: gender,
      });
    }
  }

  if (errors.length > 0) {
    return ResponseUtils.validationError(
      res,
      "Validation failed",
      errors.map((e) => `${e.field}: ${e.message}`).join(", "),
      "validation"
    );
  }

  next();
};

export const validateAdminUserUpdate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    firstName,
    lastName,
    phone,
    dateOfBirth,
    gender,
    role,
    isActive,
    isVerified,
  } = req.body;

  const errors: ValidationError[] = [];

  // Name validation
  if (firstName !== undefined) {
    if (!firstName || firstName.trim().length === 0) {
      errors.push({
        field: "firstName",
        message: "First name cannot be empty",
        value: firstName,
      });
    } else if (firstName.length > APP_CONSTANTS.NAME_MAX_LENGTH) {
      errors.push({
        field: "firstName",
        message: `First name must be less than ${APP_CONSTANTS.NAME_MAX_LENGTH} characters`,
        value: firstName,
      });
    }
  }

  if (lastName !== undefined) {
    if (!lastName || lastName.trim().length === 0) {
      errors.push({
        field: "lastName",
        message: "Last name cannot be empty",
        value: lastName,
      });
    } else if (lastName.length > APP_CONSTANTS.NAME_MAX_LENGTH) {
      errors.push({
        field: "lastName",
        message: `Last name must be less than ${APP_CONSTANTS.NAME_MAX_LENGTH} characters`,
        value: lastName,
      });
    }
  }

  // Phone validation (optional)
  if (phone !== undefined) {
    if (phone && phone.length > APP_CONSTANTS.PHONE_MAX_LENGTH) {
      errors.push({
        field: "phone",
        message: `Phone number must be less than ${APP_CONSTANTS.PHONE_MAX_LENGTH} characters`,
        value: phone,
      });
    }
  }

  // Date of birth validation (optional)
  if (dateOfBirth !== undefined) {
    if (dateOfBirth) {
      const date = new Date(dateOfBirth);
      if (isNaN(date.getTime())) {
        errors.push({
          field: "dateOfBirth",
          message: "Invalid date format. Use YYYY-MM-DD",
          value: dateOfBirth,
        });
      } else if (date > new Date()) {
        errors.push({
          field: "dateOfBirth",
          message: "Date of birth cannot be in the future",
          value: dateOfBirth,
        });
      }
    }
  }

  // Gender validation (optional)
  if (gender !== undefined) {
    if (gender && !Object.values(GENDER_OPTIONS).includes(gender)) {
      errors.push({
        field: "gender",
        message: `Gender must be one of: ${Object.values(GENDER_OPTIONS).join(", ")}`,
        value: gender,
      });
    }
  }

  // Role validation (optional)
  if (role !== undefined) {
    if (role && !Object.values(USER_ROLES).includes(role)) {
      errors.push({
        field: "role",
        message: `Role must be one of: ${Object.values(USER_ROLES).join(", ")}`,
        value: role,
      });
    }
  }

  // Boolean validations
  if (isActive !== undefined && typeof isActive !== "boolean") {
    errors.push({
      field: "isActive",
      message: "isActive must be a boolean",
      value: isActive,
    });
  }

  if (isVerified !== undefined && typeof isVerified !== "boolean") {
    errors.push({
      field: "isVerified",
      message: "isVerified must be a boolean",
      value: isVerified,
    });
  }

  if (errors.length > 0) {
    return ResponseUtils.validationError(
      res,
      "Validation failed",
      errors.map((e) => `${e.field}: ${e.message}`).join(", "),
      "validation"
    );
  }

  next();
};

export const validateUserId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.params;

  if (!userId) {
    return ResponseUtils.validationError(
      res,
      "User ID is required",
      "userId parameter is missing",
      "userId"
    );
  }

  // Basic MongoDB ObjectId validation
  if (!/^[0-9a-fA-F]{24}$/.test(userId)) {
    return ResponseUtils.validationError(
      res,
      "Invalid user ID format",
      "userId must be a valid MongoDB ObjectId",
      "userId"
    );
  }

  next();
};

export const validatePagination = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { page, limit } = req.query;

  const errors: ValidationError[] = [];

  // Page validation
  if (page !== undefined) {
    const pageNum = parseInt(page as string, 10);
    if (isNaN(pageNum) || pageNum < 1) {
      errors.push({
        field: "page",
        message: "Page must be a positive integer",
        value: page,
      });
    }
  }

  // Limit validation
  if (limit !== undefined) {
    const limitNum = parseInt(limit as string, 10);
    if (isNaN(limitNum) || limitNum < 1) {
      errors.push({
        field: "limit",
        message: "Limit must be a positive integer",
        value: limit,
      });
    } else if (limitNum > APP_CONSTANTS.MAX_PAGE_SIZE) {
      errors.push({
        field: "limit",
        message: `Limit cannot exceed ${APP_CONSTANTS.MAX_PAGE_SIZE}`,
        value: limit,
      });
    }
  }

  if (errors.length > 0) {
    return ResponseUtils.validationError(
      res,
      "Validation failed",
      errors.map((e) => `${e.field}: ${e.message}`).join(", "),
      "validation"
    );
  }

  next();
};
