import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { validate } from "../middleware/validate";
import * as appController from "../controllers/applicationController";
import {
  ApplicationSchema,
  StatusSchema,
  UpdateApplicationSchema,
} from "../schemas/authSchema";

const router = Router();

router.use(authMiddleware);

router.get("/", appController.getAll);
router.post("/", validate(ApplicationSchema), appController.create);
router.delete("/:id", appController.remove);
router.patch("/:id/status", validate(StatusSchema), appController.updateStatus);
router.patch(
  "/:id",
  validate(UpdateApplicationSchema),
  appController.updateFields,
);
router.get("/:id/activity", appController.getActivity);

export default router;
