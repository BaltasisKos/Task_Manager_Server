import mongoose from "mongoose";
import Team from "../models/teamModel.js";

// GET all teams
export const getTeams = async (req, res) => {
  try {
    const teams = await Team.find({deleted: false}).populate("members", "name email");
    res.status(200).json(teams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST create team
export const createTeam = async (req, res) => {
  try {
    const { name, description, members } = req.body;

    const memberIds = members?.map((m) => (m._id ? m._id : m)) || [];

    const team = await Team.create({
      name,
      description,
      members: memberIds,
      status: "active",
      deleted: false,
    });

    const populatedTeam = await team.populate("members", "name email");
    res.status(201).json(populatedTeam);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Failed to create team" });
  }
};

// GET single team
export const getTeam = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid Team ID" });

    const team = await Team.findById(id).populate("members", "name email");
    if (!team) return res.status(404).json({ message: "Team not found" });

    res.status(200).json(team);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT update team
export const updateTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, members } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid Team ID" });

    const team = await Team.findById(id);
    if (!team) return res.status(404).json({ message: "Team not found" });

    team.name = name || team.name;
    team.description = description || team.description;
    if (members) team.members = members.map((m) => (m._id ? m._id : m));

    const updatedTeam = await team.save();
    const populatedTeam = await updatedTeam.populate("members", "name email");

    res.status(200).json(populatedTeam);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE team permanently
export const deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid Team ID" });

    const team = await Team.findByIdAndDelete(id);
    if (!team) return res.status(404).json({ message: "Team not found" });

    res.status(200).json({ message: "Team permanently deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Soft-delete (archive) team
export const softDeleteTeam = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid Team ID" });

    const team = await Team.findById(id);
    if (!team) return res.status(404).json({ message: "Team not found" });

    team.status = "archived";
    team.deleted = true;

    await team.save();
    res.status(200).json(team);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Restore archived team
export const restoreTeam = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid Team ID" });

    const team = await Team.findById(id);
    if (!team) return res.status(404).json({ message: "Team not found" });

    team.status = "active";
    team.deleted = false;

    await team.save();
    res.status(200).json(team);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET archived teams
export const getArchivedTeams = async (req, res) => {
  try {
    const archivedTeams = await Team.find({ deleted: true, status: "archived" })
      .populate("members", "name email");
    res.status(200).json(archivedTeams);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch archived teams" });
  }
};
