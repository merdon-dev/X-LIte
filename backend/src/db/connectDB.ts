import mongoose from "mongoose";
import { MONGO_URI } from "../config/env.js";

export const connectDB = async () => {
  try {
    if (!MONGO_URI) {
      throw new Error("MONGO_URI is missing");
    }

    await mongoose.connect(MONGO_URI, {
      dbName: "x-lite",
    });

    console.log("DB connected successfully");

    mongoose.connection.on("connected", () => {
      console.log("📦 MongoDB connected");
    });

    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ MongoDB disconnected");
    });
  } catch (error) {
    console.error("❌ Error connecting DB:", error);
    process.exit(1);
  }
};
