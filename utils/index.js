import jwt from "jsonwebtoken";

const createJWT = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("token", token, {
    httpOnly: true,                              // ✅ keep cookie safe from JS
    secure: process.env.NODE_ENV === "production", // true only in prod (HTTPS)
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // lax for dev, none for prod
    maxAge: 24 * 60 * 60 * 1000,                 // 1 day
  });
};

export default createJWT;
