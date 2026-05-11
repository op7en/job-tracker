import { beforeEach, describe, expect, it, vi } from "vitest";
import pool from "../db";
import * as activityRepo from "../repositories/activityRepo";
import * as repo from "../repositories/applicationRepo";
import * as applicationService from "./applicationService";

vi.mock("../db", () => ({
  default: {
    connect: vi.fn(),
  },
}));

vi.mock("../repositories/applicationRepo", () => ({
  getAll: vi.fn(),
  create: vi.fn(),
  remove: vi.fn(),
  updateStatus: vi.fn(),
  updateFields: vi.fn(),
}));

vi.mock("../repositories/activityRepo", () => ({
  log: vi.fn(),
  getByApplicationId: vi.fn(),
}));

const app = {
  id: 10,
  user_id: 1,
  company: "Acme",
  position: "Frontend Developer",
  status: "applied",
  date_applied: "2026-05-11T00:00:00.000Z",
  notes: "",
};

const createClient = () => ({
  query: vi.fn().mockResolvedValue({ rows: [] }),
  release: vi.fn(),
});

describe("applicationService", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns all applications for a user", async () => {
    vi.mocked(repo.getAll).mockResolvedValue([app]);

    await expect(applicationService.getAll(1)).resolves.toEqual([app]);
    expect(repo.getAll).toHaveBeenCalledWith(1);
    expect(pool.connect).not.toHaveBeenCalled();
  });

  it("creates an application and activity log in one transaction", async () => {
    const client = createClient();
    vi.mocked(pool.connect).mockResolvedValue(client);
    vi.mocked(repo.create).mockResolvedValue(app);

    await expect(
      applicationService.create(1, "Acme", "Frontend Developer"),
    ).resolves.toEqual(app);

    expect(client.query).toHaveBeenNthCalledWith(1, "BEGIN");
    expect(repo.create).toHaveBeenCalledWith(
      1,
      "Acme",
      "Frontend Developer",
      "",
      client,
    );
    expect(activityRepo.log).toHaveBeenCalledWith(
      app.id,
      "created",
      {
        company: "Acme",
        position: "Frontend Developer",
      },
      client,
    );
    expect(client.query).toHaveBeenNthCalledWith(2, "COMMIT");
    expect(client.release).toHaveBeenCalledTimes(1);
  });

  it("rolls back create when activity logging fails", async () => {
    const client = createClient();
    vi.mocked(pool.connect).mockResolvedValue(client);
    vi.mocked(repo.create).mockResolvedValue(app);
    vi.mocked(activityRepo.log).mockRejectedValue(new Error("log failed"));

    await expect(
      applicationService.create(1, "Acme", "Frontend Developer"),
    ).rejects.toThrow("log failed");

    expect(client.query).toHaveBeenNthCalledWith(1, "BEGIN");
    expect(client.query).toHaveBeenNthCalledWith(2, "ROLLBACK");
    expect(client.release).toHaveBeenCalledTimes(1);
  });

  it("rejects updateStatus with an invalid status before opening a transaction", async () => {
    await expect(
      applicationService.updateStatus("10", 1, "banana"),
    ).rejects.toThrow("Invalid status");

    expect(pool.connect).not.toHaveBeenCalled();
    expect(repo.updateStatus).not.toHaveBeenCalled();
    expect(activityRepo.log).not.toHaveBeenCalled();
  });
});
