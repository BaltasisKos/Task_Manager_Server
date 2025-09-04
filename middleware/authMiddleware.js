import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const protectRoute = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json({ status: false, message: "Not authorized. Try login again." });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Use the correct field from JWT
    const userId = decodedToken.userId; // <-- must match createJWT

    const user = await User.findById(userId).select("isAdmin email");

    if (!user) {
      return res
        .status(401)
        .json({ status: false, message: "User not found. Try login again." });
    }

    req.user = {
      userId: user._id.toString(),
      email: user.email,
      isAdmin: user.isAdmin,
      roles: decodedToken.roles || [],
    };

    next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    return res
      .status(401)
      .json({ status: false, message: "Not authorized. Try login again." });
  }
});

// Admin check
const isAdminRoute = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return res.status(401).json({
      status: false,
      message: "Not authorized as admin. Try login as admin.",
    });
  }
};

export { protectRoute, isAdminRoute };
