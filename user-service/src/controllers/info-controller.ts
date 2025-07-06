import { Handler } from "express";
import { StatusCodes } from "http-status-codes";

export const info: Handler = (req, res) => {
  res.status(StatusCodes.OK).json({
    success: true,
    message: "API is live",
    error: {},
    data: {},
  });
};
