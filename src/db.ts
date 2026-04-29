import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;
const shouldUseSsl =
  process.env.NODE_ENV === "production" || databaseUrl?.includes("sslmode=require");

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: shouldUseSsl ? { rejectUnauthorized: false } : false,
});

export default pool;
