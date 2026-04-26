import { cleanupExpired } from "../repositories/refreshTokenRepo";

const run = async () => {
  const deleted = await cleanupExpired();
  console.log(`Cleanup complete. Removed ${deleted} stale refresh tokens.`);
};

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Cleanup failed:", err);
    process.exit(1);
  });
