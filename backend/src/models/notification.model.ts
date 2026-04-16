import mongoose, { Document, Types } from "mongoose";

export type NotificationKind = "like" | "comment" | "follow";

export interface INotification extends Document {
  from: Types.ObjectId;
  to: Types.ObjectId;
  type: NotificationKind;
  read: boolean;
  postId?: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new mongoose.Schema<INotification>(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["like", "comment", "follow"],
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  },
  { timestamps: true },
);

NotificationSchema.index({ to: 1, createdAt: -1 });

const Notification = mongoose.model<INotification>(
  "Notification",
  NotificationSchema,
);

export default Notification;
