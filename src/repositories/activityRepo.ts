import pool from "../db";

export const log = async (
  applicationId: number,
  type: string,
  payload?: Record<string, any>,
) => {
  await pool.query(
    `INSERT INTO activity_logs (application_id, type, payload)
     VALUES ($1, $2, $3)`,
    [applicationId, type, payload ? JSON.stringify(payload) : null],
  );
};

export const getByApplicationId = async (
  applicationId: number,
  userId: number,
) => {
  const result = await pool.query(
    `SELECT al.*
     FROM activity_logs al
     JOIN applications a ON a.id = al.application_id
     WHERE al.application_id = $1
       AND a.user_id = $2
     ORDER BY al.created_at DESC`,
    [applicationId, userId],
  );
  return result.rows;
};
