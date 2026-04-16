import { Router } from "express";
import {
  deleteAllNotifications,
  getAllNotifications,
} from "../controllers/notification.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = Router();

router.get("/", protectRoute, getAllNotifications);
router.delete("/", protectRoute, deleteAllNotifications);

export default router;
