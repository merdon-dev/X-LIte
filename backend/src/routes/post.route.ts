import { Router } from "express";
import {
  commentPostById,
  createPost,
  getAllPosts,
  getPostById,
  likePostById,
  deletePostById,
  deletePostCommentById,
  editPostById,
  getAllPostsByUser,
  getLikedPosts,
  getFollowingUsersPost,
  getPostByUserName,
} from "../controllers/post.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = Router();

// GET Method
router.get("/get-allPosts", protectRoute, getAllPosts);
router.get("/get-allPostsByUser", protectRoute, getAllPostsByUser);
router.get("/get/:id", protectRoute, getPostById);
router.get("/likes/:id", protectRoute, getLikedPosts);
router.get("/following-posts", protectRoute, getFollowingUsersPost);
router.get("/user/:userName", protectRoute, getPostByUserName);

// POST Method
router.post("/create", protectRoute, createPost);
router.post("/edit/:id", protectRoute, editPostById);
router.post("/like/:id", protectRoute, likePostById);
router.post("/comment/:id", protectRoute, commentPostById);
// router.post("/edit", createPost)

// DELETE Method
router.delete("/delete/:id", protectRoute, deletePostById);
router.delete(
  "/comment/:postId/delete/:commentId",
  protectRoute,
  deletePostCommentById,
);

export default router;
