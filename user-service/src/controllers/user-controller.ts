import { Request, Response } from "express";
import { registerUser } from "../services/user-service";
import { StatusCodes } from "http-status-codes";

export const register = async (req: Request, res: Response) => {
  try {
    const user = await registerUser(req.body);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "User registered successfully.",
      error: {},
      data: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    const error = err as Error;
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Registration failed.",
      error: { message: error.message },
      data: {},
    });
  }
};
