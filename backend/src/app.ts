import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
const app = express();
import {
  ALLOWED_PATHS,
  CLOUDNARY_API_KEY,
  CLOUDNARY_API_SECRET,
  CLOUDNARY_CLOUD_NAME,
} from "./config/env.js";
import { connectDB } from "./db/connectDB.js";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import postRouter from "./routes/post.route.js";
import notificationRouter from "./routes/notification.route.js";
import cloudinary from "cloudinary";
import cors from "cors";
import path from "path";

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

cloudinary.v2.config({
  cloud_name: CLOUDNARY_CLOUD_NAME as string,
  api_key: CLOUDNARY_API_KEY as string,
  api_secret: CLOUDNARY_API_SECRET as string,
});

// app.use(
//   cors({
//     origin: ALLOWED_PATHS,
//     credentials: true,
//   }),
// );
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.get("/check", (req, res) => {
  res.send("NEW SERVER WORKING");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/profile", userRouter);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/notification", notificationRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(process.cwd(), "frontend/dist")));

  app.get("*", (req: Request, res: Response) => {
    res.sendFile(path.join(process.cwd(), "frontend/dist/index.html"));
  });
}

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
  });
});
