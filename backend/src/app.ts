import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";

import {
  ALLOWED_PATHS,
  CLOUDNARY_API_KEY,
  CLOUDNARY_API_SECRET,
  CLOUDNARY_CLOUD_NAME,
} from "./config/env.js";

import { connectDB } from "./db/connectDB.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import postRouter from "./routes/post.route.js";
import notificationRouter from "./routes/notification.route.js";

const app = express();

// ✅ middleware
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || ALLOWED_PATHS.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

// ✅ cloudinary
cloudinary.config({
  cloud_name: CLOUDNARY_CLOUD_NAME as string,
  api_key: CLOUDNARY_API_KEY as string,
  api_secret: CLOUDNARY_API_SECRET as string,
});

// ✅ routes
app.get("/check", (req, res) => {
  res.send("NEW SERVER WORKING");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/profile", userRouter);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/notification", notificationRouter);

// ✅ error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ✅ start server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
