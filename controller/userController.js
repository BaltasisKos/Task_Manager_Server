import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import createJWT from "../utils/index.js";

// ===========================
// POST - Login User
// ===========================
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !user.isActive) {
    return res.status(401).json({
      status: false,
      message: !user
        ? "Invalid email or password."
        : "User account has been deactivated, contact the administrator",
    });
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res.status(401).json({ status: false, message: "Invalid email or password" });
  }

  // ✅ Pass full user object
  createJWT(res, user);

  user.password = undefined;
  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    title: user.title,
    isAdmin: user.isAdmin,
  });
});

// ===========================
// POST - Register User (Self-registration)
// ===========================
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, title } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ status: false, message: "Email address already exists" });
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
    title,
    isAdmin: role === "admin",
  });

  if (!user) {
    return res.status(400).json({ status: false, message: "Invalid user data" });
  }

  createJWT(res, user);
  user.password = undefined;

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    title: user.title,
    role: user.role,
    isAdmin: user.isAdmin,
  });
});

// ===========================
// POST - Logout User
// ===========================
const logoutUser = (req, res) => {
  res.cookie("token", "", { httpOnly: true, expires: new Date(0), path: "/" });
  res.status(200).json({ message: "Logged out successfully" });
};

// ===========================
// GET - Team List
// ===========================
const getTeamList = asyncHandler(async (req, res) => {
  const { search } = req.query;
  let query = {};

  if (search) {
    query = {
      $or: [
        { title: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
        { role: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    };
  }

  const users = await User.find(query).select("name title role email isActive");
  res.status(200).json(users);
});

// ===========================
// GET - User Task Status
// ===========================
const getUserTaskStatus = asyncHandler(async (req, res) => {
  const tasks = await User.find().populate("tasks", "title stage").sort({ _id: -1 });
  res.status(200).json(tasks);
});

// ===========================
// PUT - Update User Profile
// ===========================
const updateUserProfile = asyncHandler(async (req, res) => {
  const { userId, isAdmin } = req.user;
  const { _id } = req.body;

  const id = isAdmin ? _id || userId : userId;

  const user = await User.findById(id);
  if (!user) return res.status(404).json({ status: false, message: "User not found" });

  user.name = req.body.name || user.name;
  user.title = req.body.title || user.title;
  user.role = req.body.role || user.role;

  const updatedUser = await user.save();
  updatedUser.password = undefined;

  res.status(200).json({ status: true, message: "Profile Updated Successfully.", user: updatedUser });
});

// ===========================
// PUT - Activate/Deactivate User
// ===========================
const activateUserProfile = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);

  if (!user) return res.status(404).json({ status: false, message: "User not found" });

  user.isActive = req.body.isActive;
  await user.save();
  user.password = undefined;

  res.status(200).json({
    status: true,
    message: `User account has been ${user.isActive ? "activated" : "disabled"}`,
  });
});

// ===========================
// PUT - Change Password
// ===========================
const changeUserPassword = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const user = await User.findById(userId);

  if (!user) return res.status(404).json({ status: false, message: "User not found" });

  user.password = req.body.password;
  await user.save();
  user.password = undefined;

  res.status(200).json({ status: true, message: "Password changed successfully." });
});

// ===========================
// DELETE - Delete User
// ===========================
const deleteUserProfile = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await User.findByIdAndDelete(id);
  res.status(200).json({ status: true, message: "User deleted successfully" });
});

// ===========================
// POST - Admin Create User
// ===========================
const createUserByAdmin = asyncHandler(async (req, res) => {
  const { name, email, role, title, isActive } = req.body;

  if (!name || !email || !role) {
    return res.status(400).json({ message: "Name, email, and role are required" });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ message: "User already exists" });

  const defaultPassword = "Temp1234!";
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);

  const newUser = await User.create({
    name,
    email,
    role,
    title,
    isActive,
    password: hashedPassword,
  });

  res.status(201).json({
    ...newUser.toObject(),
    password: undefined,
    message: `User created with temporary password: ${defaultPassword}`,
  });
});

export {
  loginUser,
  registerUser,
  logoutUser,
  getTeamList,
  getUserTaskStatus,
  updateUserProfile,
  activateUserProfile,
  changeUserPassword,
  deleteUserProfile,
  createUserByAdmin,
};
