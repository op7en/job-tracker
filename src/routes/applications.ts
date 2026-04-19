import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import * as appController from "../controllers/applicationController";

const router = Router();

router.use(authMiddleware);

router.get("/", appController.getAll);
router.post("/", appController.create);
router.delete("/:id", appController.remove);
router.patch("/:id/status", appController.updateStatus);
router.patch("/:id", appController.updateFields);

export default router;
