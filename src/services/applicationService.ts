import pool, { type DbClient } from "../db";
import * as repo from "../repositories/applicationRepo";
import * as activityRepo from "../repositories/activityRepo";
import type { ApplicationUpdate } from "../repositories/applicationRepo";
import { isApplicationStatus } from "../domain/applicationStatus";

const withTransaction = async <T>(
  callback: (client: DbClient) => Promise<T>,
): Promise<T> => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

export const getAll = (userId: number) => repo.getAll(userId);

export const create = async (
  userId: number,
  company: string,
  position: string,
  notes?: string,
) => {
  return withTransaction(async (client) => {
    const app = await repo.create(userId, company, position, notes ?? "", client);
    await activityRepo.log(app.id, "created", { company, position }, client);
    return app;
  });
};

export const remove = (id: string, userId: number) => repo.remove(id, userId);

export const updateStatus = async (
  id: string,
  userId: number,
  status: string,
) => {
  if (!isApplicationStatus(status)) throw new Error("Invalid status");
  return withTransaction(async (client) => {
    const app = await repo.updateStatus(id, userId, status, client);
    if (app) {
      await activityRepo.log(app.id, "status_changed", { status }, client);
    }
    return app;
  });
};

export const updateFields = async (
  id: string,
  userId: number,
  body: ApplicationUpdate,
) => {
  const { company, position, status, notes } = body;
  if (status !== undefined) {
    if (!isApplicationStatus(status)) throw new Error("Invalid status");
  }

  return withTransaction(async (client) => {
    const app = await repo.updateFields(
      id,
      userId,
      {
        company,
        position,
        status,
        notes,
      },
      client,
    );

    if (app) {
      await activityRepo.log(app.id, "updated", body, client);
    }

    return app;
  });
};

export const getActivityLogs = (applicationId: number, userId: number) => {
  return activityRepo.getByApplicationId(applicationId, userId);
};
