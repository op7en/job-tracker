import "dotenv/config";
import express from "express";
import authRoutes from "./routes/auth";
import applicationRoutes from "./routes/applications";
import cors from "cors";
import helmet from "helmet";
import pool from "./db";
import { runMigrations } from "./scripts/migrate";

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

const PORT = process.env.PORT || 3000;
let server: ReturnType<typeof app.listen> | undefined;

const shutdown = (signal: string) => {
  console.log(`${signal} received, shutting down gracefully`);

  if (!server) {
    void pool.end().finally(() => process.exit(0));
    return;
  }

  const forceExit = setTimeout(() => {
    console.error("Graceful shutdown timed out");
    process.exit(1);
  }, 10_000);
  forceExit.unref();

  server.close((err?: Error) => {
    if (err) {
      console.error("HTTP server shutdown failed:", err);
      clearTimeout(forceExit);
      process.exit(1);
    }

    pool
      .end()
      .then(() => {
        clearTimeout(forceExit);
        process.exit(0);
      })
      .catch((poolErr) => {
        console.error("Database pool shutdown failed:", poolErr);
        clearTimeout(forceExit);
        process.exit(1);
      });
  });
};

const startServer = async () => {
  try {
    await runMigrations();
    server = app.listen(PORT, () =>
      console.log(`Server is running on port ${PORT}`),
    );
  } catch (err) {
    console.error("Failed to initialize database:", err);
    process.exit(1);
  }
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

startServer();
