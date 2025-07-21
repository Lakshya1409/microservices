export const APP_CONSTANTS = {
  API_VERSION: "1.0.0",
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  EMAIL_MAX_LENGTH: 254,
  NAME_MAX_LENGTH: 100,
  PHONE_MAX_LENGTH: 20,
  SESSION_EXPIRY_HOURS: 24,
  MAX_ACTIVE_SESSIONS: 5,
  TOKEN_EXPIRY_MINUTES: 15,
  REFRESH_TOKEN_EXPIRY_DAYS: 7,
  RATE_LIMIT_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: 100,
  LOGIN_ATTEMPT_LIMIT: 5,
  LOGIN_LOCKOUT_DURATION_MINUTES: 15,
} as const;

export const USER_ROLES = {
  ADMIN: "admin",
  CUSTOMER: "customer",
  MODERATOR: "moderator",
} as const;

export const USER_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  SUSPENDED: "suspended",
  PENDING: "pending",
} as const;

export const GENDER_OPTIONS = {
  MALE: "male",
  FEMALE: "female",
  OTHER: "other",
  PREFER_NOT_TO_SAY: "prefer_not_to_say",
} as const;

export const SESSION_STATUS = {
  ACTIVE: "active",
  EXPIRED: "expired",
  REVOKED: "revoked",
} as const;

export const TOKEN_TYPES = {
  ACCESS: "access",
  REFRESH: "refresh",
} as const;
