import fs from "fs/promises";
import path from "path";
import pool from "../db";

const MIGRATIONS_TABLE = "schema_migrations";

const ensureMigrationsTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ${MIGRATIONS_TABLE} (
      name VARCHAR(255) PRIMARY KEY,
      run_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
};

const getAppliedMigrations = async (): Promise<Set<string>> => {
  const res = await pool.query<{ name: string }>(
    `SELECT name FROM ${MIGRATIONS_TABLE}`,
  );
  return new Set(res.rows.map((r) => r.name));
};

const getMigrationFiles = async (): Promise<string[]> => {
  const migrationsDir = path.resolve(process.cwd(), "migrations");
  const entries = await fs.readdir(migrationsDir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".sql"))
    .map((entry) => entry.name)
    .sort();
};

const runMigrationFile = async (filename: string) => {
  const filePath = path.resolve(process.cwd(), "migrations", filename);
  const sql = await fs.readFile(filePath, "utf8");

  await pool.query("BEGIN");
  try {
    await pool.query(sql);
    await pool.query(`INSERT INTO ${MIGRATIONS_TABLE} (name) VALUES ($1)`, [
      filename,
    ]);
    await pool.query("COMMIT");
    console.log(`Applied migration: ${filename}`);
  } catch (err) {
    await pool.query("ROLLBACK");
    throw err;
  }
};

export const runMigrations = async () => {
  await ensureMigrationsTable();
  const applied = await getAppliedMigrations();
  const files = await getMigrationFiles();

  for (const file of files) {
    if (applied.has(file)) continue;
    await runMigrationFile(file);
  }

  console.log("Migrations are up to date");
};

if (require.main === module) {
  runMigrations()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Migration failed:", err);
      process.exit(1);
    });
}
