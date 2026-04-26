import express from "express";
import authRoutes from "./routes/auth";
import applicationRoutes from "./routes/applications";
import cors from "cors";
import helmet from "helmet";
import pool from "./db";
import { runMigrations } from "./scripts/migrate";

const app = express();

// Railway работает за прокси — доверяем одному слою прокси,
// чтобы req.ip содержал реальный IP клиента (для rate-limit)
app.set("trust proxy", 1);

app.use(helmet());
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
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

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await runMigrations();
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  } catch (err) {
    console.error("Failed to initialize database:", err);
    process.exit(1);
  }
};

startServer();
