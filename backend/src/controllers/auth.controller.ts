import type { Request, Response } from "express";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import { serverErrorMsg } from "../services/helper.js";

export const SignUp = async (req: Request, res: Response) => {
  try {
    const { userName, fullName, email, password } = req.body;

    const emailRegex = /^\S+@\S+\.\S+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const existingUserName = await User.findOne({ userName });
    if (existingUserName) {
      return res.status(400).json({ message: "Username already exists" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      userName,
      fullName,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    if (savedUser) {
      generateToken({ userId: String(savedUser._id), res });
    }

    res.status(201).json({
      success: true,
      data: savedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: serverErrorMsg(),
    });
  }
};

export const SignIn = async (req: Request, res: Response) => {
  try {
    const { userName, password } = req.body;

    const user = User.findOne({ userName }).select("-password");
    const isPasswordHasMatch = await bcrypt.compare(password, user.password);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: serverErrorMsg(),
    });
  }
};
