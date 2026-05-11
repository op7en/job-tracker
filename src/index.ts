import "dotenv/config";
import app from "./app";
import pool from "./db";
import { runMigrations } from "./scripts/migrate";

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
