import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      default: null,
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      default: null,
    },
    type: {
      type: String,
      enum: ["like", "comment", "follow"],
      required: true,
      default: null,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Notification = mongoose.model("Notification", NotificationSchema);

export default Notification;

export type NotificationType = mongoose.Document & {
  from: mongoose.Types.ObjectId;
  to: mongoose.Types.ObjectId;
  type: string;
  read: boolean;
};
