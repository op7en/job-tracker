import { Pool, type PoolConfig, type QueryResult, type QueryResultRow } from "pg";

export type DbClient = {
  query<T extends QueryResultRow = QueryResultRow>(
    text: string,
    values?: unknown[],
  ): Promise<QueryResult<T>>;
};

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
  return { rejectUnauthorized: process.env.NODE_ENV === "production" };
};

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: buildSslConfig(),
  max: Number(process.env.DATABASE_POOL_MAX ?? 10),
  idleTimeoutMillis: 30_000,
});

export default pool;
