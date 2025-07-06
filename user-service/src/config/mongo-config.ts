import mongoose from "mongoose";
import { ServerConfig } from "./server-config";
import { Logger } from "./logger-config";

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
