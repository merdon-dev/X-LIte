import { NextFunction, Request, Response } from "express";
import User from "../models/user.model.js";
import AppError from "../utils/AppError.js";
import Notification from "../models/notification.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "cloudinary";

export const getUserByUserName = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userName } = req.params;

    const user = await User.findOne({ userName: userName as string }).select(
      "-password",
    );

    if (!user) {
      next(new AppError("User not found", 404));
    } else {
      res.json({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const getAllUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const allUsers = await User.find().select("-password");

    res.json({
      success: true,
      data: allUsers,
    });
  } catch (error) {
    next(error);
  }
};

export const followUnFollowUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    if (!req.user) {
      return next(new AppError("User not found", 404));
    }
    if (!id) {
      return next(new AppError("User id is required", 400));
    }

    if (id === req.user._id.toString()) {
      return next(new AppError("You can't follow yourself", 400));
    }

    const userToModify = await User.findById(id);
    const currentUser = req.user;

    if (!userToModify || !currentUser) {
      return next(new AppError("User not found", 404));
    }

    const isFollowing = currentUser.following.includes(userToModify._id);

    if (isFollowing) {
      // Unfollow
      await User.findByIdAndUpdate(userToModify._id, {
        $pull: {
          followers: currentUser._id,
        },
      });

      await User.findByIdAndUpdate(currentUser._id, {
        $pull: { following: userToModify._id },
      });
      return res.json({
        success: true,
        message: "Unfollowed user successfully",
      });
    } else {
      // Follow
      await User.findByIdAndUpdate(userToModify._id, {
        $push: {
          followers: currentUser._id,
        },
      });

      await User.findByIdAndUpdate(currentUser._id, {
        $push: { following: userToModify._id },
      });
      const newNotification = new Notification({
        from: currentUser._id,
        to: userToModify._id,
        type: "follow",
      });
      await newNotification.save();
      return res.json({ success: true, message: "Followed user successfully" });
    }
  } catch (error) {
    next(error);
  }
};

export const getSuggestedUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return next(new AppError("User not found", 404));
    }

    const userId = req.user._id;

    const usersFollowedByMe = await User.findById(userId);

    const randomUsers = await User.aggregate([
      {
        $match: {
          _id: { $ne: userId },
        },
      },
      {
        $sample: { size: 10 },
      },
    ]);

    const suggestedUsers = randomUsers.filter((u) => {
      return !usersFollowedByMe?.following.some(
        (id) => id.toString() === u._id.toString(),
      );
    });

    if (!suggestedUsers) {
      return next(new AppError("No suggested users found", 404));
    }

    suggestedUsers.slice(0, 4);

    res.json({
      success: true,
      message: "Get suggested users successfully",
      data: suggestedUsers,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      userName,
      fullName,
      email,
      newPassword,
      password: existingPassword,
      bio,
    } = req.body;
    let { profileImage, coverImage } = req.body;

    if (!req.user) {
      return next(new AppError("User not found", 404));
    }

    const userId = req.user._id;

    const user = await User.findById(userId).select("+password");

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    if (existingPassword && !newPassword) {
      return next(new AppError("New password is required", 400));
    } else if (newPassword && !existingPassword) {
      return next(new AppError("Current password is required", 400));
    }

    if (existingPassword && newPassword) {
      const isPasswordHasMatch = await bcrypt.compare(
        existingPassword,
        user.password,
      );
      if (!isPasswordHasMatch) {
        return next(new AppError("Current password is incorrect", 400));
      }
      const genSalt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, genSalt);
      if (hashedPassword === user.password) {
        return next(new AppError("New password is same as old password", 400));
      }
      user.password = hashedPassword;
    }

    if (email) {
      const emailRegex = /^\S+@\S+\.\S+$/;

      if (!emailRegex.test(email)) {
        return next(new AppError("Invalid email address", 400));
      }

      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return next(new AppError("Email already exists", 400));
      }
    }
    if (userName) {
      const existingUserName = await User.findOne({ userName });
      if (existingUserName) {
        return next(new AppError("Username already exists", 400));
      }
    }

    if (profileImage) {
      if (user.profileImage) {
        cloudinary.v2.uploader.destroy(
          user.profileImage.split("/").pop()?.split(".")[0] as string,
          (err: any, result: any) => {
            if (err) {
              return next(new AppError("Error deleting profile image", 500));
            }
          },
        );
      }
      const uploadedImage = await cloudinary.v2.uploader.upload(
        profileImage,
        (err: any, result: any) => {
          if (err) {
            return next(new AppError("Error uploading profile image", 500));
          }
        },
      );
      profileImage = uploadedImage.secure_url;
    }

    if (coverImage) {
      if (user.coverImage) {
        cloudinary.v2.uploader.destroy(
          user.coverImage.split("/").pop()?.split(".")[0] as string,
          (err: any, result: any) => {
            if (err) {
              return next(new AppError("Error deleting profile image", 500));
            }
          },
        );
      }
      const uploadedImage = await cloudinary.v2.uploader.upload(
        coverImage,
        (err: any, result: any) => {
          if (err) {
            return next(new AppError("Error uploading profile image", 500));
          }
        },
      );
      coverImage = uploadedImage.secure_url;
    }

    user.userName = userName || user.userName;
    user.email = email || user.email;
    user.fullName = fullName || user.fullName;
    user.bio = bio || user.bio;
    user.profileImage = profileImage || user.profileImage;
    user.coverImage = coverImage || user.coverImage;

    await user.save();

    user.password = "**********";

    res.json({
      success: true,
      message: "Update user profile successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
