import { Pool, type PoolConfig, type QueryResult, type QueryResultRow } from "pg";

export type DbClient = {
  query<T extends QueryResultRow = QueryResultRow>(
    text: string,
    values?: unknown[],
  ): Promise<QueryResult<T>>;
};

const databaseUrl = process.env.DATABASE_URL;
const shouldUseSsl =
  process.env.NODE_ENV === "production" || databaseUrl?.includes("sslmode=require");
const isRailwayRuntime = Boolean(
  process.env.RAILWAY_ENVIRONMENT ||
    process.env.RAILWAY_ENVIRONMENT_NAME ||
    process.env.RAILWAY_PROJECT_ID ||
    process.env.RAILWAY_SERVICE_ID,
);

const buildSslConfig = (): PoolConfig["ssl"] => {
  if (!shouldUseSsl) return false;
  const ca = process.env.DATABASE_CA_CERT;
  if (ca) {
    return { ca, rejectUnauthorized: true };
  }
  return { rejectUnauthorized: !isRailwayRuntime };
};

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: buildSslConfig(),
  max: Number(process.env.DATABASE_POOL_MAX ?? 10),
  idleTimeoutMillis: 30_000,
});

export default pool;
