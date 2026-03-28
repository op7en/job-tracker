import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import applicationRoutes from "./routes/applications";
import cors from "cors";
import pool from "./db";
dotenv.config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
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
  console.log("Tables ready");
};

createTables();
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
