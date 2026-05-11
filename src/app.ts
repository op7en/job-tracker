import express from "express";
import authRoutes from "./routes/auth";
import applicationRoutes from "./routes/applications";
import cors from "cors";
import helmet from "helmet";
import pool from "./db";

const app = express();

app.set("trust proxy", 1);

app.use(helmet());
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/ready", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.status(200).json({ status: "ready" });
  } catch (err) {
    console.error("readiness check failed:", err);
    res.status(503).json({ status: "not_ready" });
  }
});

app.use("/auth", authRoutes);
app.use("/applications", applicationRoutes);

export default app;
