import express from "express";
import {
  getTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
  softDeleteTask,
  restoreTask
} from "../controller/taskController.js";

const router = express.Router();

router.route("/")
  .get(getTasks)
  .post(createTask);

router.route("/:id")
  .get(getTask)
  .put(updateTask)
  .delete(deleteTask)
  .patch(softDeleteTask); // PATCH for soft delete

router.route("/:id/restore")
  .patch(restoreTask); // PATCH for restore

export default router;
