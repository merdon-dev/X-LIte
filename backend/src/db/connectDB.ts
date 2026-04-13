import mongoose from "mongoose";
import { MONGO_URI } from "../config/env.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI as string);
    console.log("Db connected successfully");
  } catch (error) {
    console.log(`error in connecting db :${error}`);
    process.exit(1);
  }
};
