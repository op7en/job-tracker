import pool, { type DbClient } from "../db";

export type ApplicationUpdate = {
  company?: string;
  position?: string;
  status?: string;
  notes?: string;
};

const UPDATE_COLUMNS: Array<keyof ApplicationUpdate> = [
  "company",
  "position",
  "status",
  "notes",
];

export const getAll = async (userId: number) => {
  const result = await pool.query(
    "SELECT * FROM applications WHERE user_id = $1 ORDER BY date_applied DESC",
    [userId],
  );
  return result.rows;
};

export const create = async (
  userId: number,
  company: string,
  position: string,
  notes: string,
  client: DbClient = pool,
) => {
  const result = await client.query(
    `INSERT INTO applications (user_id, company, position, notes)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [userId, company, position, notes],
  );
  return result.rows[0];
};

export const remove = async (id: string, userId: number) => {
  const result = await pool.query(
    "DELETE FROM applications WHERE id = $1 AND user_id = $2 RETURNING *",
    [id, userId],
  );
  return result.rows[0] || null;
};

export const updateStatus = async (
  id: string,
  userId: number,
  status: string,
  client: DbClient = pool,
) => {
  const result = await client.query(
    "UPDATE applications SET status = $1 WHERE id = $2 AND user_id = $3 RETURNING *",
    [status, id, userId],
  );
  return result.rows[0] || null;
};

export const updateFields = async (
  id: string,
  userId: number,
  fields: ApplicationUpdate,
  client: DbClient = pool,
) => {
  const updates: string[] = [];
  const values: unknown[] = [];

  UPDATE_COLUMNS.forEach((column) => {
    const value = fields[column];
    if (value !== undefined) {
      values.push(value);
      updates.push(`${column} = $${values.length}`);
    }
  });

  if (updates.length === 0) throw new Error("No fields to update");

  values.push(id, userId);
  const result = await client.query(
    `UPDATE applications SET ${updates.join(", ")}
     WHERE id = $${values.length - 1} AND user_id = $${values.length} RETURNING *`,
    values,
  );
  return result.rows[0] || null;
};
