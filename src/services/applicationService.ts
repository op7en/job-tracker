import * as repo from "../repositories/applicationRepo";

const VALID_STATUSES = ["applied", "interview", "rejected", "offer"];

export const getAll = (userId: number) => repo.getAll(userId);

export const create = (
  userId: number,
  company: string,
  position: string,
  notes: string,
) => repo.create(userId, company, position, notes);

export const remove = (id: string, userId: number) => repo.remove(id, userId);

export const updateStatus = (id: string, userId: number, status: string) => {
  if (!VALID_STATUSES.includes(status)) throw new Error("Invalid status");
  return repo.updateStatus(id, userId, status);
};

export const updateFields = (
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
  return repo.updateFields(id, userId, updates, values);
};
