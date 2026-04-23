import { Request, Response } from "express";
import * as appService from "../services/applicationService";

interface AuthRequest extends Request {
  userId: number;
}

export const getAll = async (req: AuthRequest, res: Response) => {
  try {
    const data = await appService.getAll(req.userId);
    res.json(data);
  } catch (err) {
    console.error("getAll failed:", err);
    res.status(500).json({ error: "Failed to load applications" });
  }
};

export const create = async (req: AuthRequest, res: Response) => {
  const { company, position, notes } = req.body;
  try {
    const data = await appService.create(
      req.userId,
      company,
      position,
      notes || "",
    );
    res.status(201).json(data);
  } catch (err) {
    console.error("create failed:", err);
    res.status(500).json({ error: "Failed to create application" });
  }
};

export const remove = async (req: AuthRequest, res: Response) => {
  try {
    const deleted = await appService.remove(String(req.params.id), req.userId);
    if (!deleted)
      return res.status(404).json({ error: "Application not found" });
    res.json({ message: "Application deleted" });
  } catch (err) {
    console.error("remove failed:", err);
    res.status(500).json({ error: "Failed to delete application" });
  }
};

export const updateStatus = async (req: AuthRequest, res: Response) => {
  try {
    const updated = await appService.updateStatus(
      String(req.params.id),
      req.userId,
      req.body.status,
    );
    if (!updated)
      return res.status(404).json({ error: "Application not found" });
    res.json(updated);
  } catch (err) {
    console.error("updateStatus failed:", err);
    res.status(400).json({ error: "Failed to update status" });
  }
};

export const updateFields = async (req: AuthRequest, res: Response) => {
  try {
    const updated = await appService.updateFields(
      String(req.params.id),
      req.userId,
      req.body,
    );
    if (!updated)
      return res.status(404).json({ error: "Application not found" });
    res.json(updated);
  } catch (err) {
    console.error("updateFields failed:", err);
    res.status(400).json({ error: "Failed to update application" });
  }
};
