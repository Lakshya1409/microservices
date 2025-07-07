import mongoose from "mongoose";
import { ServerConfig } from "./server-config.js";
import { Logger } from "./logger-config.js";

export const connectMongo = async () => {
  try {
    await mongoose.connect(ServerConfig.MONGODB_URI);
    Logger.info("MongoDB connected successfully");
  } catch (error) {
    Logger.error(`MongoDB connection error: ${error}`);
    process.exit(1);
  }
};

export { mongoose };
