import { Router } from "express";
import {
  followUnFollowUser,
  getAllUser,
  getSuggestedUsers,
  getUserByUserName,
  updateUserProfile,
} from "../controllers/user.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = Router();

router.get("/profile/:userName", protectRoute, getUserByUserName);
router.get("/user/get-all", protectRoute, getAllUser);
router.post("/follow-unfollow/:id", protectRoute, followUnFollowUser);
router.get("/suggested-users", protectRoute, getSuggestedUsers);
router.post("/profile/update-user", protectRoute, updateUserProfile);

export default router;
