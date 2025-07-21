import { Handler } from "express";
import { ResponseUtils } from "../utils/response";
import { SUCCESS_MESSAGES } from "../utils/messages";

export const info: Handler = (req, res) => {
  ResponseUtils.success(
    res,
    {
      service: "user-service",
      version: "1.0.0",
      status: "healthy",
      timestamp: new Date().toISOString(),
    },
    SUCCESS_MESSAGES.API_LIVE
  );
};
