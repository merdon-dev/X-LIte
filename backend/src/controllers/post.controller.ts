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
    const userId = req.user?._id;
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
        data: newPost,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const getAllPosts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const allPosts = await PostDb.find()
      .sort({ createdAt: 1 })
      .populate({
        path: "userId",
        select: [
          "-password",
          "-following",
          "-followers",
          "-bio",
          "-link",
          "-coverImage",
        ],
      })
      .populate({
        path: "comments.userId",
        select: [
          "-password",
          "-following",
          "-followers",
          "-bio",
          "-link",
          "-coverImage",
        ],
      });
    console.log({ allPosts });
    if (allPosts.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Get All Posts Fetched Successfully",
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Get All Posts Fetched Successfully",
      data: allPosts,
    });
  } catch (error) {
    next(error);
  }
};
export const getAllPostsByUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?._id;
    const allPostsByUser = await PostDb.find({ userId: userId! }).sort({
      createdAt: -1,
    });
    if (allPostsByUser.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Get All Posts Fetched Successfully",
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Get All Posts Fetched Successfully",
      data: allPostsByUser,
    });
  } catch (error) {
    next(error);
  }
};

export const getPostById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const postId = req.params.id;

    if (!postId) {
      return next(new AppError("PostId is required", 400));
    }

    const post = await PostDb.findById(postId);
    if (!post) {
      return next(new AppError("No Post available for this id", 404));
    }
    return res.status(200).json({
      success: true,
      message: "Post Fetched Successfully",
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

export const editPostById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?._id;
    let { text, image } = req.body;
    const postId = req.params.id;

    if (!postId) {
      return next(new AppError("Post Id is required", 400));
    }

    if (!text && !image) {
      return next(
        new AppError("Either post text or post image is required", 400),
      );
    }

    const post = await PostDb.findById(postId);
    if (!post) {
      return next(new AppError("Post not found", 404));
    }

    if (post.userId.toString() !== userId?.toString()) {
      return next(new AppError("Forbidden: You can't edit this post", 403));
    }

    let updatedImage = post.image;

    if (image) {
      if (post.image) {
        try {
          const parts = post.image.split("/");
          const publicIdWithExt = parts.slice(-2).join("/");
          const publicId = publicIdWithExt.split(".")[0] as string;

          await cloudinary.v2.uploader.destroy(publicId);
        } catch (err) {
          console.warn("Old image delete failed:", err);
        }
      }

      const uploadedRes = await cloudinary.v2.uploader.upload(image);
      updatedImage = uploadedRes.secure_url;
    }

    const updatedPost = await PostDb.findOneAndUpdate(
      {
        _id: postId,
        userId: userId,
      },
      {
        $set: {
          text: text ?? post.text,
          image: updatedImage,
        },
      },
      { returnDocument: "after" },
    );

    if (!updatedPost) {
      return next(new AppError("Update failed", 400));
    }

    return res.status(200).json({
      success: true,
      message: "Post Updated Successfully",
      data: updatedPost,
    });
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
    const userId = req.user?._id;
    const postId = req.params.id;

    if (!postId) {
      return next(new AppError("Post Id is required", 400));
    }

    const post = await PostDb.findById(postId);
    if (!post) {
      return next(new AppError("No post available with this Id", 400));
    }

    const postCreator = await User.findById(post.userId);

    console.log(post.likes);
    const isAlreadyLiked = post.likes.some((like) => {
      return like.userId && like.userId.toString() === userId?.toString();
    });

    let updatedPost;

    if (isAlreadyLiked) {
      updatedPost = await PostDb.findByIdAndUpdate(
        postId,
        { $pull: { likes: { userId } } },
        { returnDocument: "after" },
      );
      await User.updateOne(
        { _id: userId! },
        {
          $pull: {
            likedPosts: postId,
          },
        },
      );
    } else {
      updatedPost = await PostDb.findByIdAndUpdate(
        postId,
        { $push: { likes: { userId } } },
        { returnDocument: "after" },
      );
      await User.updateOne(
        { _id: userId! },
        {
          $push: {
            likedPosts: postId,
          },
        },
      );
    }

    if (!isAlreadyLiked && postCreator) {
      const notification = new Notification({
        from: userId,
        to: post.userId,
        type: "like",
      });

      await notification.save();
    }

    return res.status(200).json({
      success: true,
      message: `Post ${isAlreadyLiked ? "Un-Liked" : "Liked"} Successfully`,
      data: updatedPost,
    });
  } catch (error) {
    next(error);
  }
};

export const commentPostById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?._id;
    const postId = req.params.id;
    const { userComment } = req.body;

    if (!postId) {
      return next(new AppError("Post Id is Required", 400));
    }

    if (!userComment || userComment.trim() === "") {
      return next(new AppError("User comment not found", 400));
    }

    const trimmedComment = userComment.trim();

    if (trimmedComment.length > 500) {
      return next(new AppError("Comment too long", 400));
    }

    // 🔍 Fetch post for validation + duplicate check
    const post = await PostDb.findById(postId);
    if (!post) {
      return next(new AppError("Post is not available", 404));
    }

    // ⚠️ Duplicate check
    const lastComment = post.comments.at(-1);
    if (
      lastComment &&
      lastComment.userId.toString() === userId?.toString() &&
      lastComment.comment === trimmedComment
    ) {
      return next(new AppError("Duplicate comment", 400));
    }

    const newComment = {
      userId,
      comment: trimmedComment,
    };

    // 🔥 Atomic update
    const updatedPost = await PostDb.findByIdAndUpdate(
      postId,
      {
        $push: {
          comments: {
            $each: [newComment],
            $slice: -100,
          },
        },
      },
      { returnDocument: "after" },
    );

    // 🔔 Notification (avoid self)
    if (post.userId.toString() !== userId?.toString()) {
      await new Notification({
        from: userId,
        to: post.userId,
        type: "comment",
      }).save();
    }

    const latestComment = updatedPost?.comments.at(-1);

    return res.status(201).json({
      success: true,
      message: "Post commented successfully",
      data: latestComment,
      totalComments: updatedPost?.comments.length,
    });
  } catch (error) {
    next(error);
  }
};

// export const commentPostByIdUsingSave = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   try {
//     const userId = req.user._id;
//     const postId = req.params.id;
//     const { userComment } = req.body;

//     if (!postId) {
//       return next(new AppError("Post Id is Required", 400));
//     }

//     if (!userComment || userComment.trim() === "") {
//       return next(new AppError("User comment not found", 400));
//     }

//     const trimmedComment = userComment.trim();

//     if (trimmedComment.length > 500) {
//       return next(new AppError("Comment too long", 400));
//     }

//     // 🔍 Fetch full document
//     const post = await PostDb.findById(postId);
//     if (!post) {
//       return next(new AppError("Post is not available", 404));
//     }

//     // ⚠️ Duplicate check
//     const lastComment = post.comments.at(-1);
//     if (
//       lastComment &&
//       lastComment.userId.toString() === userId.toString() &&
//       lastComment.comment === trimmedComment
//     ) {
//       return next(new AppError("Duplicate comment", 400));
//     }

//     // 🧩 Add comment
//     post.comments.push({
//       userId,
//       comment: trimmedComment,
//     });

//     // 🧹 Limit comments manually
//     // if (post.comments.length > 100) {
//     //   post.comments = post.comments.slice(-100);
//     // }

//     // 💾 SAVE (IMPORTANT)
//     await post.save();

//     // 🔔 Notification
//     if (post.userId.toString() !== userId.toString()) {
//       await new Notification({
//         from: userId,
//         to: post.userId,
//         type: "comment",
//       }).save();
//     }

//     const latestComment = post.comments.at(-1);

//     return res.status(201).json({
//       success: true,
//       message: "Post commented successfully",
//       comment: latestComment,
//       totalComments: post.comments.length,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

export const deletePostById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?._id;
    const postId = req.params.id;

    if (!postId) {
      return next(new AppError("Post Id is Required", 400));
    }

    const post = await PostDb.findById(postId);
    if (!post) {
      return next(new AppError("Post is not available", 404));
    }

    if (post.userId.toString() !== userId?.toString()) {
      return next(
        new AppError(
          "Unauthenticated: You don't have permission to delete this post",
          403,
        ),
      );
    }

    if (post.image) {
      const parts = post.image.split("/");
      const publicIdWithExt = parts.slice(-2).join("/");
      const publicId = publicIdWithExt.split(".")[0] as string;
      try {
        await cloudinary.v2.uploader.destroy(publicId);
      } catch (err) {
        console.warn("Image delete failed:", err);
      }
    }

    await PostDb.findByIdAndDelete(postId);

    return res.status(200).json({
      success: true,
      message: "Post Deleted Successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const deletePostCommentById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?._id;
    const { postId, commentId } = req.params;

    if (!postId || !commentId) {
      return next(new AppError("Post Id and Comment Id are required", 400));
    }

    const updatedPost = await PostDb.findOneAndUpdate(
      {
        _id: postId,
        "comments._id": commentId,
        $or: [{ "comments.userId": userId }, { userId: userId }],
      } as any,
      {
        $pull: {
          comments: { _id: commentId },
        },
      },
      { returnDocument: "after" },
    );

    if (!updatedPost) {
      return next(
        new AppError(
          "Comment not found or you are not authorized to delete it",
          404,
        ),
      );
    }

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
      data: updatedPost,
    });
  } catch (error) {
    next(error);
  }
};

export const getLikedPosts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return next(new AppError("User Not Found", 404));
    }
    console.log({ user });

    const likedPosts = await PostDb.find({ _id: { $in: user.likedPosts } })
      .sort({ createdAt: -1 })
      .populate({
        path: "userId",
        select: [
          "-password",
          "-following",
          "-followers",
          "-bio",
          "-link",
          "-coverImage",
        ],
      });
    console.log(likedPosts);

    return res.status(200).json({
      success: true,
      message: "Liked Post Fetched Successfully",
      data: likedPosts,
    });
  } catch (error) {
    console.log(`error in get liked posts ${error}`);
    next(error);
  }
};

export const getFollowingUsersPost = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user?._id) {
      return next(new AppError("Unauthorized", 401));
    }
    const user = req.user;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    if (!user.following || user.following.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No following users",
        data: [],
      });
    }

    const followingUsersPost = await PostDb.find({
      userId: { $in: user.following },
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "userId",
        select: "userName profileImage fullName",
      })
      .lean();
    const meta = {
      page,
      limit,
      count: followingUsersPost.length,
    };

    return res.status(200).json({
      success: true,
      message: "Following users' posts fetched successfully",
      data: followingUsersPost,
      meta,
    });
  } catch (error) {
    console.log(`error in get following user's posts ${error}`);
    next(error);
  }
};

export const getPostByUserName = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userName = req.params.userName;

    if (!userName) {
      return next(new AppError("User name is required", 400));
    }

    const user = await User.findOne({ userName });
    if (!user) {
      return next(new AppError("User Not Found", 404));
    }

    const postByUser = await PostDb.find({
      userId: user._id,
    })
      .sort({ createdAt: -1 })
      .populate({
        path: "userId",
        select: "userName profileImage fullName",
      });

    return res.status(200).json({
      success: true,
      message: "Posts fetched successfully",
      data: postByUser,
    });
  } catch (error) {
    console.log(`error in get posts by username ${error}`);
    next(error);
  }
};
