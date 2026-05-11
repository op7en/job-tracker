ALTER TABLE applications
  ADD CONSTRAINT status_check
  CHECK (status IN ('applied', 'interview', 'rejected', 'offer'));

ALTER TABLE applications
  ALTER COLUMN date_applied TYPE TIMESTAMPTZ
  USING date_applied::timestamptz;

CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);

ALTER TABLE activity_logs
  DROP CONSTRAINT IF EXISTS activity_logs_application_id_fkey;

ALTER TABLE activity_logs
  ADD CONSTRAINT fk_activity_app
  FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE;
