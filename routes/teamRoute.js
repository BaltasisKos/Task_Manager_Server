import express from "express";
import Team from "../models/teamModel.js";

const router = express.Router();

// @desc    Get all teams
// @route   GET /api/teams
// @access  Public
router.get("/", async (req, res) => {
  try {
    // Populate members with name and email
    const teams = await Team.find().populate("members", "name email");
    res.json(teams);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch teams" });
  }
});

// @desc    Create a team
// @route   POST /api/teams
// @access  Public
router.post("/", async (req, res) => {
  try {
    const { name, description, members } = req.body;

    // Ensure members is an array of IDs
    const memberIds = members.map(member => (member._id ? member._id : member));

    const team = await Team.create({ name, description, members: memberIds });
    const populatedTeam = await team.populate("members", "name email");
    res.status(201).json(populatedTeam);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Failed to create team" });
  }
});

// @desc    Update a team
// @route   PUT /api/teams/:id
// @access  Public
router.put("/:id", async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: "Team not found" });

    const { name, description, members } = req.body;

    team.name = name || team.name;
    team.description = description || team.description;

    if (members) {
      team.members = members.map(member => (member._id ? member._id : member));
    }

    const updatedTeam = await team.save();
    const populatedTeam = await updatedTeam.populate("members", "name email");
    res.json(populatedTeam);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Failed to update team" });
  }
});

// @desc    Delete a team
// @route   DELETE /api/teams/:id
// @access  Public
router.delete("/:id", async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: "Team not found" });

    await team.deleteOne();
    res.json({ message: "Team removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete team" });
  }
});

export default router;
