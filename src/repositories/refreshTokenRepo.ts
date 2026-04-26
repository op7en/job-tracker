import pool from "../db";

interface RefreshTokenRow {
  id: number;
  user_id: number;
  token_hash: string;
  expires_at: string;
  revoked_at: string | null;
}

export const create = async (
  userId: number,
  tokenHash: string,
  expiresAt: Date,
) => {
  const result = await pool.query<RefreshTokenRow>(
    `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [userId, tokenHash, expiresAt],
  );
  return result.rows[0];
};

export const findValidByHash = async (tokenHash: string) => {
  const result = await pool.query<RefreshTokenRow>(
    `SELECT *
     FROM refresh_tokens
     WHERE token_hash = $1
       AND revoked_at IS NULL
       AND expires_at > NOW()
     LIMIT 1`,
    [tokenHash],
  );
  return result.rows[0] || null;
};

export const revokeById = async (id: number) => {
  await pool.query(
    `UPDATE refresh_tokens
     SET revoked_at = NOW()
     WHERE id = $1 AND revoked_at IS NULL`,
    [id],
  );
};

export const revokeByHash = async (tokenHash: string) => {
  await pool.query(
    `UPDATE refresh_tokens
     SET revoked_at = NOW()
     WHERE token_hash = $1 AND revoked_at IS NULL`,
    [tokenHash],
  );
};
