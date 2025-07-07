import { StatusCodes } from "http-status-codes";

export const info = (req, res) => {
  res.status(StatusCodes.OK).json({
    success: true,
    message: "API is live",
    error: {},
    data: {},
  });
};
