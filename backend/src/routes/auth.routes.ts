import { Router } from "express";
import {
  GetUser,
  SignIn,
  SignOut,
  SignUp,
} from "../controllers/auth.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const authRouter = Router();

// Post
authRouter.post("/sign-up", SignUp);
authRouter.post("/sign-in", SignIn);
authRouter.post("/sign-out", SignOut);

// Get
authRouter.get("/get-user", protectRoute, GetUser);

export default authRouter;
