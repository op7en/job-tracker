import { Router } from "express";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import * as authController from "../controllers/authController";
import { validate } from "../middleware/validate";
import { RegisterSchema, LoginSchema } from "../schemas/authSchema";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Too many attempts. Try again in 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => ipKeyGenerator(req.ip ?? "unknown"),
});

router.post(
  "/register",
  authLimiter,
  validate(RegisterSchema),
  authController.register,
);
router.post("/login", authLimiter, validate(LoginSchema), authController.login);
router.post("/refresh", authLimiter, authController.refresh);
router.post("/logout", authController.logout);
router.post("/logout-all", authMiddleware, authController.logoutAll);

export default router;
