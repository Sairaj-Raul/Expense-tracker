import express from "express";
import cors from "cors";
import transactionRoutes from "./routes/transactionRoute.js";
import authRoutes from "./routes/authRoute.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

// Middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

// Public Routes
app.use("/api/auth", authRoutes);

// Protected Routes
app.use("/api/transactions", transactionRoutes);

// Error Handler
app.use(errorHandler);

export default app;
