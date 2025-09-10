import express from "express";
import {
  getTeams,
  createTeam,
  updateTeam,
  softDeleteTeam, // renamed from archiveTeam
  restoreTeam,
  deleteTeam,
  getArchivedTeams
} from "../controller/teamController.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protectRoute, getTeams);
router.get("/archived", protectRoute, getArchivedTeams);  
router.post("/", protectRoute, createTeam);
router.put("/:id", protectRoute, updateTeam);
router.patch("/:id/archive", protectRoute, softDeleteTeam); // use softDeleteTeam
router.patch("/:id/restore", protectRoute, restoreTeam);
router.delete("/:id", protectRoute, deleteTeam);

export default router;
