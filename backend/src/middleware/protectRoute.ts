import type { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
import userModel from "../models/user.model.js";

interface JwtPayloadCustom {
  userId: string;
}

// 🔥 extend request type
export interface AuthRequest extends Request {
  user?: any;
}

const protectRoute = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return next(new AppError("Token Not Found", 401));
    }
    const decoded = jwt.verify(
      token,
      JWT_SECRET as string,
    ) as unknown as JwtPayloadCustom;

    if (!decoded.userId) {
      return next(new AppError("Unauthorized: Invalid Token", 401));
    }

    const user = await userModel.findById(decoded.userId).select("-password");

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    req.user = user;

    next();
  } catch (error) {
    console.log(`error in protectRoute ${error}`);

    next(new AppError("Unauthorized", 401));
  }
};

export default protectRoute;
