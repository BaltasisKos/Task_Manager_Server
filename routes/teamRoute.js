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

const router = express.Router();

router.get("/", getTeams);
router.get("/archived", getArchivedTeams);  
router.post("/", createTeam);
router.put("/:id", updateTeam);
router.patch("/:id/archive", softDeleteTeam); // use softDeleteTeam
router.patch("/:id/restore", restoreTeam);
router.delete("/:id", deleteTeam);

export default router;
