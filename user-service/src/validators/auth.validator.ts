import { Request, Response, NextFunction } from "express";
import { APP_CONSTANTS, GENDER_OPTIONS } from "../utils/constants";
import { ResponseUtils } from "../utils/response";
import { ValidationError } from "../types";

export const validateRegistration = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password, firstName, lastName, phone, dateOfBirth, gender } =
    req.body;

  const errors: ValidationError[] = [];

  // Email validation
  if (!email) {
    errors.push({ field: "email", message: "Email is required" });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push({
      field: "email",
      message: "Invalid email format",
      value: email,
    });
  } else if (email.length > APP_CONSTANTS.EMAIL_MAX_LENGTH) {
    errors.push({
      field: "email",
      message: `Email must be less than ${APP_CONSTANTS.EMAIL_MAX_LENGTH} characters`,
      value: email,
    });
  }

  // Password validation
  if (!password) {
    errors.push({ field: "password", message: "Password is required" });
  } else if (password.length < APP_CONSTANTS.PASSWORD_MIN_LENGTH) {
    errors.push({
      field: "password",
      message: `Password must be at least ${APP_CONSTANTS.PASSWORD_MIN_LENGTH} characters`,
      value: password,
    });
  } else if (password.length > APP_CONSTANTS.PASSWORD_MAX_LENGTH) {
    errors.push({
      field: "password",
      message: `Password must be less than ${APP_CONSTANTS.PASSWORD_MAX_LENGTH} characters`,
      value: password,
    });
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(password)) {
    errors.push({
      field: "password",
      message:
        "Password must contain uppercase, lowercase, number, and special character",
      value: password,
    });
  }

  // Name validation
  if (!firstName) {
    errors.push({ field: "firstName", message: "First name is required" });
  } else if (firstName.length > APP_CONSTANTS.NAME_MAX_LENGTH) {
    errors.push({
      field: "firstName",
      message: `First name must be less than ${APP_CONSTANTS.NAME_MAX_LENGTH} characters`,
      value: firstName,
    });
  }

  if (!lastName) {
    errors.push({ field: "lastName", message: "Last name is required" });
  } else if (lastName.length > APP_CONSTANTS.NAME_MAX_LENGTH) {
    errors.push({
      field: "lastName",
      message: `Last name must be less than ${APP_CONSTANTS.NAME_MAX_LENGTH} characters`,
      value: lastName,
    });
  }

  // Phone validation (optional)
  if (phone && phone.length > APP_CONSTANTS.PHONE_MAX_LENGTH) {
    errors.push({
      field: "phone",
      message: `Phone number must be less than ${APP_CONSTANTS.PHONE_MAX_LENGTH} characters`,
      value: phone,
    });
  }

  // Date of birth validation (optional)
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

  // Gender validation (optional)
  if (gender && !Object.values(GENDER_OPTIONS).includes(gender)) {
    errors.push({
      field: "gender",
      message: `Gender must be one of: ${Object.values(GENDER_OPTIONS).join(", ")}`,
      value: gender,
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

export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  const errors: ValidationError[] = [];

  // Email validation
  if (!email) {
    errors.push({ field: "email", message: "Email is required" });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push({
      field: "email",
      message: "Invalid email format",
      value: email,
    });
  }

  // Password validation
  if (!password) {
    errors.push({ field: "password", message: "Password is required" });
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

export const validateRefreshToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { refreshToken } = req.body;

  const errors: ValidationError[] = [];

  if (!refreshToken) {
    errors.push({
      field: "refreshToken",
      message: "Refresh token is required",
    });
  } else if (typeof refreshToken !== "string") {
    errors.push({
      field: "refreshToken",
      message: "Refresh token must be a string",
      value: refreshToken,
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
