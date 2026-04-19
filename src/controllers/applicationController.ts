import { Request, Response } from "express";
import * as appService from "../services/applicationService";

interface AuthRequest extends Request {
  userId: number;
}

export const getAll = async (req: AuthRequest, res: Response) => {
  try {
    const data = await appService.getAll(req.userId);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const create = async (req: AuthRequest, res: Response) => {
  const { company, position, notes } = req.body;
  if (!company || !position)
    return res.status(400).json({ error: "Company and position are required" });

  try {
    const data = await appService.create(
      req.userId,
      company,
      position,
      notes || "",
    );
    res.status(201).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const remove = async (req: AuthRequest, res: Response) => {
  try {
    const deleted = await appService.remove(String(req.params.id), req.userId);
    if (!deleted)
      return res.status(404).json({ error: "Application not found" });
    res.json({ message: "Application deleted" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
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
  } catch (err: any) {
    res.status(400).json({ error: err.message });
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
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
