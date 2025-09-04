import jwt from "jsonwebtoken";

const createJWT = (res, user) => {
  const token = jwt.sign(
    { userId: user._id.toString(), isAdmin: user.isAdmin, roles: user.roles || [] },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,   // must be false on localhost HTTP
    sameSite: "lax", // "lax" works for dev
    maxAge: 24 * 60 * 60 * 1000,
    path: "/",       // send for all routes
  });

  return token;
};

export default createJWT;
