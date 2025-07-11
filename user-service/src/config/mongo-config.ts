import mongoose from "mongoose";
import { ServerConfig } from "./server-config";
import { logger } from "./logger-config";

export const connectMongo = async () => {
  try {
    await mongoose.connect(ServerConfig.MONGODB_URI);
    logger.info("MongoDB connected successfully");
  } catch (error) {
    logger.error(`MongoDB connection error: ${error}`);
    process.exit(1);
  }
};

export { mongoose };
