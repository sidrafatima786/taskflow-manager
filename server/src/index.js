// TaskFlow API entry point
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const taskRoutes = require("./routes/task.routes");
const projectRoutes = require("./routes/project.routes");
const errorHandler = require("./middleware/error.middleware");

const app = express();

// Security & parsing middleware
app.use(express.json({ limit: "100kb" }));
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN?.split(",") ?? "*",
    credentials: true,
  }),
);

// Basic rate limiting
app.use(
  "/api/",
  rateLimit({ windowMs: 15 * 60 * 1000, max: 300, standardHeaders: true, legacyHeaders: false }),
);

// Health check
app.get("/api/health", (_req, res) => res.json({ ok: true, service: "taskflow-api" }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/projects", projectRoutes);

// 404 + error handler
app.use((_req, res) => res.status(404).json({ message: "Not found" }));
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`✅ TaskFlow API running on :${PORT}`));
  })
  .catch((err) => {
    console.error("❌ Failed to start:", err.message);
    process.exit(1);
  });
