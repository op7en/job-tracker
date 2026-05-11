ALTER TABLE applications
  DROP CONSTRAINT IF EXISTS applications_user_id_fkey;

ALTER TABLE applications
  ADD CONSTRAINT applications_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
