import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
const app = express();
import {
  CLOUDNARY_API_KEY,
  CLOUDNARY_API_SECRET,
  CLOUDNARY_CLOUD_NAME,
  PORT,
} from "./config/env.js";
import { connectDB } from "./db/connectDB.js";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import postRouter from "./routes/post.route.js";
import cloudinary from "cloudinary";

app.use(express.json());
app.use(cookieParser());

cloudinary.v2.config({
  cloud_name: CLOUDNARY_CLOUD_NAME as string,
  api_key: CLOUDNARY_API_KEY as string,
  api_secret: CLOUDNARY_API_SECRET as string,
});

app.get("/check", (req, res) => {
  res.send("NEW SERVER WORKING");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1", userRouter);
app.use("/api/v1/post", postRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
  });
});
