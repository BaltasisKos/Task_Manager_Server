import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { errorHandler, routeNotFound } from "./middleware/errorMiddleware.js";
import routes from "./routes/index.js";
import dbConnection from "./utils/connectDB.js";
import userRoutes from "./routes/userRoute.js";
import taskRoutes from "./routes/taskRoute.js";

dotenv.config();
dbConnection();

const app = express();
const port = process.env.PORT || 5000;

// -------------------- CORS --------------------
app.use(
  cors({
    origin: "http://localhost:3000", // frontend URL
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    credentials: true, // important to allow cookies
  })
);

// -------------------- Middleware --------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// -------------------- Routes --------------------
app.use("/api", routes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

// -------------------- Error Handling --------------------
app.use(routeNotFound);
app.use(errorHandler);

// -------------------- Server --------------------
app.listen(port, () => console.log(`Server listening on ${port}`));
