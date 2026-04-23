import express from "express";
import authRoutes from "./routes/auth";
import applicationRoutes from "./routes/applications";
import cors from "cors";
import pool from "./db";
import helmet from "helmet";
const app = express();
app.use(helmet());
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  }),
);
app.use("/auth", authRoutes);
app.use("/applications", applicationRoutes);
const PORT = process.env.PORT || 3000;

const createTables = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS applications (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      company VARCHAR(255) NOT NULL,
      position VARCHAR(255) NOT NULL,
      status VARCHAR(50) DEFAULT 'applied',
      date_applied DATE DEFAULT CURRENT_DATE,
      notes TEXT
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS activity_logs (
      id SERIAL PRIMARY KEY,
      application_id INTEGER REFERENCES applications(id) ON DELETE CASCADE,
      type VARCHAR(50) NOT NULL,
      payload JSONB,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
  console.log("Tables ready");
};

const startServer = async () => {
  try {
    await createTables();
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  } catch (err) {
    console.error("Failed to initialize database:", err);
    process.exit(1);
  }
};

startServer();
