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

router.get("/user/get-all", protectRoute, getAllUser);
router.get("/suggested-users", protectRoute, getSuggestedUsers);

router.get("/:userName", protectRoute, getUserByUserName);

router.post("/follow-unfollow/:id", protectRoute, followUnFollowUser);
router.post("/update-user", protectRoute, updateUserProfile);

export default router;
