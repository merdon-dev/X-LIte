import { Router } from "express";
import { createPost, likePostById } from "../controllers/post.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = Router();

router.post("/create", protectRoute, createPost);
router.post("/like", protectRoute, likePostById);
// router.post("/comment", createPost)
// router.post("/edit", createPost)

export default router;
