CREATE EXTENSION IF NOT EXISTS "pgcrypto";

ALTER TABLE refresh_tokens
  ADD COLUMN IF NOT EXISTS family_id UUID NOT NULL DEFAULT gen_random_uuid();

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_family_id
  ON refresh_tokens(family_id);