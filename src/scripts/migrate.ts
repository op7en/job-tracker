import fs from "fs/promises";
import path from "path";
import type { PoolClient } from "pg";
import pool from "../db";

const MIGRATIONS_TABLE = "schema_migrations";
const MIGRATION_LOCK_KEY = 4242;

const ensureMigrationsTable = async (client: PoolClient) => {
  await client.query(`
    CREATE TABLE IF NOT EXISTS ${MIGRATIONS_TABLE} (
      name VARCHAR(255) PRIMARY KEY,
      run_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
};

const getAppliedMigrations = async (
  client: PoolClient,
): Promise<Set<string>> => {
  const res = await client.query<{ name: string }>(
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

const runMigrationFile = async (client: PoolClient, filename: string) => {
  const filePath = path.resolve(process.cwd(), "migrations", filename);
  const sql = await fs.readFile(filePath, "utf8");

  await client.query("BEGIN");
  try {
    await client.query(sql);
    await client.query(`INSERT INTO ${MIGRATIONS_TABLE} (name) VALUES ($1)`, [
      filename,
    ]);
    await client.query("COMMIT");
    console.log(`Applied migration: ${filename}`);
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  }
};

export const runMigrations = async () => {
  const client = await pool.connect();
  try {
    await client.query("SELECT pg_advisory_lock($1)", [MIGRATION_LOCK_KEY]);

    try {
      await ensureMigrationsTable(client);
      const applied = await getAppliedMigrations(client);
      const files = await getMigrationFiles();

      for (const file of files) {
        if (applied.has(file)) continue;
        await runMigrationFile(client, file);
      }

      console.log("Migrations are up to date");
    } finally {
      await client.query("SELECT pg_advisory_unlock($1)", [MIGRATION_LOCK_KEY]);
    }
  } finally {
    client.release();
  }
};

if (require.main === module) {
  runMigrations()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Migration failed:", err);
      process.exit(1);
    });
}
