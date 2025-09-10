import express from "express";
import {
  getTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
  softDeleteTask,
  restoreTask,
  searchAll
} from "../controller/taskController.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(protectRoute, getTasks)
  .post(protectRoute, createTask);

router.route("/search")
  .get(protectRoute, searchAll); // GET for search

router.route("/:id")
  .get(protectRoute, getTask)
  .put(protectRoute, updateTask)
  .delete(protectRoute, deleteTask)
  .patch(protectRoute, softDeleteTask); // PATCH for soft delete

router.route("/:id/restore")
  .patch(protectRoute, restoreTask); // PATCH for restore

export default router;
