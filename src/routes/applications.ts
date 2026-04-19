import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import * as appController from "../controllers/applicationController";
import * as activityRepo from "../repositories/activityRepo";


const router = Router();

router.use(authMiddleware);

router.get("/", appController.getAll);
router.post("/", appController.create);
router.delete("/:id", appController.remove);
router.patch("/:id/status", appController.updateStatus);
router.patch("/:id", appController.updateFields);


router.get("/:id/activity", async (req, res) => {
  try {
    const logs = await activityRepo.getByApplicationId(Number(req.params.id));
    res.json(logs);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
