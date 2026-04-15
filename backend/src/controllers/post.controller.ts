import { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError.js";
import cloudinary from "cloudinary";
import PostDb from "../models/post.model.js";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";

export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user._id;
    let { text, image } = req.body;

    if (!text && !image) {
      return next(new AppError("Text or Post image is required", 400));
    }

    if (image) {
      try {
        const uploadedRes = await cloudinary.v2.uploader.upload(image);
        image = uploadedRes.secure_url;
      } catch (err) {
        return next(new AppError("Error uploading image", 500));
      }
    }

    const newPost = new PostDb({
      userId: userId,
      text,
      image,
    });
    if (newPost) {
      await newPost.save();

      return res.status(201).json({
        success: true,
        message: "Post created Successfully",
        post: newPost,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const likePostById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user._id;
    const { postId } = req.body;

    if (!postId) {
      return next(new AppError("Post Id is require", 400));
    }
    const post = await PostDb.findById({ _id: postId });
    if (!post) {
      return next(new AppError("No post available with this Id", 400));
    }
    const postCreator = await User.findById({ _id: post.userId });

    const isAlreadyLiked = post.likes.includes(userId);
    let updatedPost;

    updatedPost = await PostDb.findByIdAndUpdate(postId, {
      $addToSet: {
        likes: { userId },
      },
    });
    if (!postCreator) {
      return next(new AppError("Post Creator is not available", 400));
    }
    const notification = new Notification({
      from: userId,
      to: post.userId,
      type: "like",
    });

    await notification.save();
    return res.status(200).json({
      success: true,
      message: "Post Liked Successfully",
      post: updatedPost,
    });
  } catch (error) {
    next(error);
  }
};
