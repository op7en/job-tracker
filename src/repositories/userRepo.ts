import pool from "../db";

export const findByEmail = async (email: string) => {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  return result.rows[0] || null;
};

export const findById = async (id: number) => {
  const result = await pool.query("SELECT id, email FROM users WHERE id = $1", [
    id,
  ]);
  return result.rows[0] || null;
};

export const createUser = async (email: string, hashedPassword: string) => {
  const result = await pool.query(
    "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
    [email, hashedPassword],
  );
  return result.rows[0];
};
