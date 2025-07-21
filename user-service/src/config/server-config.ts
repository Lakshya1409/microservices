import dotenv from "dotenv";
import {
  getRequiredEnv,
  getOptionalEnv,
  getOptionalNumberEnv,
} from "../utils/helpers";

dotenv.config();

export const ServerConfig = {
  PORT: getOptionalNumberEnv("PORT", 3001),
  LOG_LEVEL: getOptionalEnv("LOG_LEVEL", "info"),
  MONGODB_URI: getRequiredEnv("MONGODB_URI"),
  RABBITMQ_URI: getRequiredEnv("RABBITMQ_URI"),
  JWT: {
    ACCESS_TOKEN_SECRET: getRequiredEnv("JWT_ACCESS_TOKEN_SECRET"),
    REFRESH_TOKEN_SECRET: getRequiredEnv("JWT_REFRESH_TOKEN_SECRET"),
  },
} as const;
