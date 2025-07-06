import dotenv from "dotenv";
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error("MONGODB_URI environment variable is required");
}

export const ServerConfig = {
  PORT: process.env.PORT || 3001,
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
  MONGODB_URI,
};
