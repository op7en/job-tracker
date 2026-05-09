import pool from "../db";

interface RefreshTokenRow {
  id: number;
  user_id: number;
  token_hash: string;
  expires_at: string;
  revoked_at: string | null;
  family_id: string;
  created_at: string;
}

export interface RotateResult {
  user_id: number;
  family_id: string;
}

export const create = async (
  userId: number,
  tokenHash: string,
  expiresAt: Date,
  familyId?: string,
) => {
  if (familyId) {
    const result = await pool.query<RefreshTokenRow>(
      `INSERT INTO refresh_tokens (user_id, token_hash, expires_at, family_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [userId, tokenHash, expiresAt, familyId],
    );
    return result.rows[0];
  }

  const result = await pool.query<RefreshTokenRow>(
    `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [userId, tokenHash, expiresAt],
  );
  return result.rows[0];
};

export const rotate = async (
  tokenHash: string,
): Promise<RotateResult | null> => {
  const result = await pool.query<RotateResult>(
    `UPDATE refresh_tokens
     SET revoked_at = NOW()
     WHERE token_hash = $1
       AND revoked_at IS NULL
       AND expires_at > NOW()
     RETURNING user_id, family_id`,
    [tokenHash],
  );
  return result.rows[0] ?? null;
};

export const findByHash = async (
  tokenHash: string,
): Promise<RefreshTokenRow | null> => {
  const result = await pool.query<RefreshTokenRow>(
    `SELECT * FROM refresh_tokens WHERE token_hash = $1 LIMIT 1`,
    [tokenHash],
  );
  return result.rows[0] ?? null;
};

export const revokeFamilyById = async (familyId: string): Promise<void> => {
  await pool.query(
    `UPDATE refresh_tokens
     SET revoked_at = NOW()
     WHERE family_id = $1 AND revoked_at IS NULL`,
    [familyId],
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
