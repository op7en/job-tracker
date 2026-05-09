import { Pool, PoolConfig } from "pg";

const databaseUrl = process.env.DATABASE_URL;
const shouldUseSsl =
  process.env.NODE_ENV === "production" ||
  databaseUrl?.includes("sslmode=require");

const buildSslConfig = (): PoolConfig["ssl"] => {
  if (!shouldUseSsl) return false;
  const ca = process.env.DATABASE_CA_CERT;
  if (ca) {
    return { ca, rejectUnauthorized: true };
  }
  return { rejectUnauthorized: false };
};

const databaseUrl = process.env.DATABASE_URL;
const shouldUseSsl =
  process.env.NODE_ENV === "production" || databaseUrl?.includes("sslmode=require");

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: buildSslConfig(),
  max: Number(process.env.DATABASE_POOL_MAX ?? 10),
  idleTimeoutMillis: 30_000,
});

export default pool;
