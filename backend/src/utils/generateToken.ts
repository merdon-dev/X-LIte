import type { Response } from "express";
import { serverErrorMsg } from "../services/helper.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";

const generateToken = async ({
  userId,
  res,
}: {
  userId: string;
  res: Response;
}) => {
  const NODE_ENV = process.env.NODE_ENV;
  try {
    const token = jwt.sign({ userId }, JWT_SECRET as string, {
      expiresIn: "15d",
    });

    res.cookie("jwt", token, {
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
