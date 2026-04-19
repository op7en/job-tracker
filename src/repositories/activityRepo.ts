import pool from "../db";

export const log = async (
  applicationId: number,
  type: string,
  payload?: Record<string, any>
) => {
  await pool.query(
    `INSERT INTO activity_logs (application_id, type, payload)
     VALUES ($1, $2, $3)`,
    [applicationId, type, payload ? JSON.stringify(payload) : null]
  );
};

export const getByApplicationId = async (applicationId: number) => {
  const result = await pool.query(
    `SELECT * FROM activity_logs
     WHERE application_id = $1
     ORDER BY created_at DESC`,
    [applicationId]
  );
  return result.rows;
};