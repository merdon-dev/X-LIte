import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
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
          default: "",
        },
      },
    ],
  },
  { timestamps: true },
);

const PostDb = mongoose.model("Post", PostSchema);

export default PostDb;
