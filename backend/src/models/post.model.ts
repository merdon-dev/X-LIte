import mongoose, { Document, Types } from "mongoose";

// ✅ Interface
export interface IPost extends Document {
  userId: Types.ObjectId;

  text: string;
  image: string;

  likes: {
    userId: Types.ObjectId;
  }[];

  comments: {
    userId: Types.ObjectId;
    comment: string;
    createdAt: Date;
  }[];

  createdAt: Date;
  updatedAt: Date;
}

// ✅ Schema
const PostSchema = new mongoose.Schema<IPost>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    likes: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      },
    ],
    comments: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        comment: {
          type: String,
          required: true,
          trim: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
          index: true,
        },
      },
    ],
  },
  { timestamps: true },
);

// ✅ Model
const PostDb = mongoose.model<IPost>("Post", PostSchema);

export default PostDb;
