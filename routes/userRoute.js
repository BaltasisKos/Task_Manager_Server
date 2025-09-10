import express from "express";
import {
  activateUserProfile,
  changeUserPassword,
  deleteUserProfile,
  getTeamList,
  getUserTaskStatus,
  loginUser,
  logoutUser,
  registerUser,
  updateUserProfile,
  createUserByAdmin,
  getNotifications,
  markNotificationAsRead,
} from "../controller/userController.js";
import { isAdminRoute, protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

// -------------------- Public routes --------------------
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// -------------------- Protected routes --------------------
router.get("/get-team", protectRoute, getTeamList);
router.get("/get-status", protectRoute, getUserTaskStatus);
router.get("/notifications", protectRoute, getNotifications);

router.put("/profile", protectRoute, updateUserProfile);
router.put("/change-password", protectRoute, changeUserPassword);
router.put("/read-noti", protectRoute, markNotificationAsRead);

// -------------------- Admin routes --------------------
router.post("/", protectRoute, isAdminRoute, createUserByAdmin);

router
  .route("/:id")
  .put(protectRoute, isAdminRoute, activateUserProfile)
  .delete(protectRoute, isAdminRoute, deleteUserProfile);

export default router;
