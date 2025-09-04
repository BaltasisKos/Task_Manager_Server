const bcrypt = require('bcrypt');
const User = require('../models/userModel.js');
const authService = require('../services/auth.service.js');

exports.login = async (req, res) => {
  console.log("Login user", req.body);

  const { username, password } = req.body;

  try {
    const user = await User.findOne(
      { username },
      { username: 1, email: 1, password: 1, roles: 1 }
    );

    if (!result) {
      return res.status(404).json({ status: false, data: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = authService.generateAccessToken(user);

      // 🔥 Set token as cookie
      res.cookie("token", token, {
        httpOnly: true,        // cookie not accessible by JS
        secure: false,         // set true in production with HTTPS
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });

      return res.status(200).json({
        status: true,
        message: "Login successful",
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          roles: user.roles,
        },
      });
    } else {
      return res
        .status(401)
        .json({ status: false, data: "Invalid username or password" });
    }
  } catch (err) {
    console.log("Problem in logging", err);
    return res.status(400).json({ status: false, data: err });
  }
};
