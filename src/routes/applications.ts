import { Router, Request, Response } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import pool from "../db";

const router = Router();

// Расширяем тип Request для добавления userId
interface AuthRequest extends Request {
  userId: number;
}

// Все маршруты требуют авторизации
router.use(authMiddleware);

// GET /applications — получить все заявки пользователя
router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT * FROM applications WHERE user_id = $1 ORDER BY date_applied DESC",
      [req.userId],
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
});

// POST /applications — создать новую заявку
router.post("/", async (req: AuthRequest, res: Response) => {
  const { company, position, notes } = req.body;

  if (!company || !position) {
    return res.status(400).json({ error: "Company and position are required" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO applications (user_id, company, position, notes)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [req.userId, company, position, notes || ""],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create application" });
  }
});

// DELETE /applications/:id — удалить заявку
router.delete("/:id", async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM applications WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, req.userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Application not found" });
    }

    res.json({ message: "Application deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete application" });
  }
});

// PATCH /applications/:id/status — обновить только статус
router.patch("/:id/status", async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ["applied", "interview", "rejected", "offer"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  try {
    const result = await pool.query(
      "UPDATE applications SET status = $1 WHERE id = $2 AND user_id = $3 RETURNING *",
      [status, id, req.userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Application not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update status" });
  }
});

// PATCH /applications/:id — обновить любые поля заявки (редактирование)
router.patch("/:id", async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { company, position, status, notes } = req.body;

  // Собираем только те поля, которые переданы
  const updates: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (company !== undefined) {
    updates.push(`company = $${paramIndex++}`);
    values.push(company);
  }
  if (position !== undefined) {
    updates.push(`position = $${paramIndex++}`);
    values.push(position);
  }
  if (status !== undefined) {
    const validStatuses = ["applied", "interview", "rejected", "offer"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }
    updates.push(`status = $${paramIndex++}`);
    values.push(status);
  }
  if (notes !== undefined) {
    updates.push(`notes = $${paramIndex++}`);
    values.push(notes);
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: "No fields to update" });
  }

  values.push(id, req.userId);

  try {
    const result = await pool.query(
      `UPDATE applications 
       SET ${updates.join(", ")}
       WHERE id = $${paramIndex++} AND user_id = $${paramIndex}
       RETURNING *`,
      values,
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Application not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update application" });
  }
});

export default router;
