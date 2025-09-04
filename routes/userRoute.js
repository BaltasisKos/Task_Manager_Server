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
} from "../controller/userController.js";
import { isAdminRoute, protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

// -------------------- Public routes --------------------
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// -------------------- Protected routes --------------------
router.get("/get-team",  getTeamList);
router.get("/get-status",  getUserTaskStatus);

router.put("/profile", updateUserProfile);
router.put("/change-password", changeUserPassword);

// -------------------- Admin routes --------------------
router.post("/", createUserByAdmin);

router
  .route("/:id")
  .put( activateUserProfile)
  .delete( deleteUserProfile);

export default router;
