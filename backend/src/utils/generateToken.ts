import type { Response } from "express";
import { serverErrorMsg } from "../services/helper.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET, NODE_ENV } from "../config/env.js";

const generateToken = async ({
  userId,
  res,
}: {
  userId: string;
  res: Response;
}) => {
  try {
    console.log(userId);
    const token = jwt.sign({ userId }, JWT_SECRET as string, {
      expiresIn: "15d",
    });

    res.cookie(token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 15 * 24 * 60 * 1000,
      secure: NODE_ENV === "production",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: serverErrorMsg(),
    });
  }
};

export default generateToken;
