import { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError.js";
import Notification from "../models/notification.model.js";

export const getAllNotifications = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return next(new AppError("User is not found", 404));
    }
    const notifications = await Notification.find({ to: userId }).populate({
      path: "from",
      select: ["userName", "fullName", "_id"],
    });
    await Notification.updateMany({ user: userId }, { read: true });
    return res.status(200).json({
      success: true,
      message: "Notifications fetched successfully",
      data: notifications,
    });
  } catch (error) {
    console.log(`Error in get all notifications ${error}`);
  }
};
export const deleteAllNotifications = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return next(new AppError("User is not found", 404));
    }

    await Notification.deleteMany({ user: userId });
    return res.status(200).json({
      success: true,
      message: "Notifications deleted successfully",
    });
  } catch (error) {
    console.log(`Error in delete all notifications ${error}`);
  }
};
