import { ServerConfig } from "./server-config";

export const AUTH_CONFIG = {
  JWT: {
    ACCESS_TOKEN_SECRET: ServerConfig.JWT.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: ServerConfig.JWT.REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRES_IN: "15m",
    REFRESH_TOKEN_EXPIRES_IN: "7d",
    ISSUER: "user-service",
    AUDIENCE: "user-service-clients",
  },
  PASSWORD: {
    SALT_ROUNDS: 12,
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SPECIAL_CHARS: true,
  },
  SESSION: {
    MAX_ACTIVE_SESSIONS: 5,
    SESSION_EXPIRY_DAYS: 30,
  },
} as const;

// Import messages from centralized message utility
export { AUTH_MESSAGES } from "../utils/messages";
