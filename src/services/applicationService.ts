import * as repo from "../repositories/applicationRepo";
import * as activityRepo from "../repositories/activityRepo";

const VALID_STATUSES = ["applied", "interview", "rejected", "offer"];

export const getAll = (userId: number) => repo.getAll(userId);

export const create = async (
  userId: number,
  company: string,
  position: string,
  notes?: string,
) => {
  const app = await repo.create(userId, company, position, notes);
  await activityRepo.log(app.id, "created", { company, position });
  return app;
};

export const remove = (id: string, userId: number) => repo.remove(id, userId);

export const updateStatus = async (
  id: string,
  userId: number,
  status: string,
) => {
  if (!VALID_STATUSES.includes(status)) throw new Error("Invalid status");
  const app = await repo.updateStatus(id, userId, status);
  if (app) {
    await activityRepo.log(app.id, "status_changed", { status });
  }
  return app;
};

export const updateFields = async (
  id: string,
  userId: number,
  body: Record<string, any>,
) => {
  const { company, position, status, notes } = body;
  const updates: string[] = [];
  const values: any[] = [];
  let i = 1;

  if (company !== undefined) {
    updates.push(`company = $${i++}`);
    values.push(company);
  }
  if (position !== undefined) {
    updates.push(`position = $${i++}`);
    values.push(position);
  }
  if (status !== undefined) {
    if (!VALID_STATUSES.includes(status)) throw new Error("Invalid status");
    updates.push(`status = $${i++}`);
    values.push(status);
  }
  if (notes !== undefined) {
    updates.push(`notes = $${i++}`);
    values.push(notes);
  }

  if (updates.length === 0) throw new Error("No fields to update");

  values.push(id, userId);
  const app = await repo.updateFields(id, userId, updates, values);

  if (app) {
    await activityRepo.log(app.id, "updated", body);
  }

  return app;
};

export const getActivityLogs = (applicationId: number, userId: number) => {
  return activityRepo.getByApplicationId(applicationId, userId);
};
