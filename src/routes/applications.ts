import { Router, Request, Response } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import pool from "../db";

const router = Router();
router.use(authMiddleware);

router.get("/", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT * FROM applications WHERE user_id = $1",
      [(req as any).userId],
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/", async (req: Request, res: Response) => {
  const { company, position, notes } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO applications (user_id, company, position, notes) VALUES ($1, $2, $3, $4) RETURNING *",
      [(req as any).userId, company, position, notes],
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "DELETE FROM applications WHERE id = $1 AND user_id = $2",
      [req.params.id, (req as any).userId],
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.patch("/:id/status", async (req: Request, res: Response) => {
  const { status } = req.body;
  try {
    const result = await pool.query(
      "UPDATE applications SET status = $1 WHERE id = $2 AND user_id = $3 RETURNING *",
      [status, req.params.id, (req as any).userId],
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
