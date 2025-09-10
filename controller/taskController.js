import mongoose from "mongoose";
import Task from "../models/taskModel.js";
import Team from "../models/teamModel.js";
import User from "../models/userModel.js";
import { createNotification } from "./userController.js";

// GET all tasks
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST create task
export const createTask = async (req, res) => {
  try {
    const { name, teamId, notes, dueDate } = req.body;
    const { userId } = req.user; // Get the user who created the task

    // Fetch the team and its members
    const team = await Team.findById(teamId).populate("members");
    if (!team) return res.status(404).json({ message: "Team not found" });

    // Create the task with team members
    const task = await Task.create({
      name,
      team: team._id,
      members: team.members.map((m) => m._id), // assign all team members
      notes,
      dueDate,
    });

    // Create notifications for all team members
    const notificationPromises = team.members.map(async (member) => {
      if (member._id.toString() !== userId) { // Don't notify the creator
        await createNotification(
          member._id,
          "task_created",
          "New Task Created",
          `A new task "${name}" has been created in your team "${team.name}"`,
          {
            taskId: task._id,
            taskName: name,
            teamId: team._id,
            teamName: team.name,
            createdBy: userId
          }
        );
      }
    });

    // Wait for all notifications to be created
    await Promise.all(notificationPromises);

    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Failed to create task" });
  }
};

// GET single task
export const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT update task
export const updateTask = async (req, res) => {
  try {
    const { userId } = req.user;
    const taskId = req.params.id;
    
    const oldTask = await Task.findById(taskId).populate('team', 'name').populate('members', 'name');
    if (!oldTask) return res.status(404).json({ message: "Task not found" });

    const task = await Task.findByIdAndUpdate(taskId, req.body, {
      new: true,
      runValidators: true,
    }).populate('team', 'name').populate('members', 'name');

    // Create notifications for task updates
    if (req.body.status && req.body.status !== oldTask.status) {
      const notificationPromises = task.members.map(async (member) => {
        if (member._id.toString() !== userId) {
          await createNotification(
            member._id,
            "task_updated",
            "Task Status Updated",
            `Task "${task.name}" status changed to "${req.body.status}"`,
            {
              taskId: task._id,
              taskName: task.name,
              oldStatus: oldTask.status,
              newStatus: req.body.status,
              updatedBy: userId
            }
          );
        }
      });
      await Promise.all(notificationPromises);
    }

    res.status(200).json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE task
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Soft-delete


export const softDeleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Task ID" });
    }

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.status = "deleted";
    await task.save();

    res.json(task);
  } catch (err) {
    console.error("Error in softDeleteTask:", err);
    res.status(500).json({ message: err.message });
  }
};





// Restore
export const restoreTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.status = "todo"; // or whatever default you want
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Search tasks and users
export const searchAll = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.status(400).json({ 
        message: "Search query must be at least 2 characters long" 
      });
    }

    const searchTerm = q.trim();
    
    // Search tasks
    const tasks = await Task.find({
      $and: [
        { status: { $ne: "deleted" } }, // Exclude deleted tasks
        {
          $or: [
            { name: { $regex: searchTerm, $options: "i" } },
            { notes: { $regex: searchTerm, $options: "i" } },
            { status: { $regex: searchTerm, $options: "i" } }
          ]
        }
      ]
    })
    .populate('team', 'name')
    .populate('members', 'name title role')
    .limit(10)
    .sort({ createdAt: -1 });

    // Search users
    const users = await User.find({
      $and: [
        { isActive: true }, // Only active users
        {
          $or: [
            { name: { $regex: searchTerm, $options: "i" } },
            { title: { $regex: searchTerm, $options: "i" } },
            { role: { $regex: searchTerm, $options: "i" } },
            { email: { $regex: searchTerm, $options: "i" } }
          ]
        }
      ]
    })
    .select('name title role email')
    .limit(10)
    .sort({ name: 1 });

    res.status(200).json({
      tasks: tasks.map(task => ({
        _id: task._id,
        name: task.name,
        status: task.status,
        team: task.team?.name || 'Unassigned',
        members: task.members?.map(member => ({
          _id: member._id,
          name: member.name,
          title: member.title,
          role: member.role
        })) || [],
        dueDate: task.dueDate,
        notes: task.notes,
        type: 'task'
      })),
      users: users.map(user => ({
        _id: user._id,
        name: user.name,
        title: user.title,
        role: user.role,
        email: user.email,
        type: 'user'
      }))
    });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ message: "Search failed" });
  }
};

