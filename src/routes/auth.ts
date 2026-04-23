import { Router } from "express";
import rateLimit from "express-rate-limit";
import * as authController from "../controllers/authController";
import { validate } from "../middleware/validate";
import { RegisterSchema, LoginSchema } from "../schemas/authSchema";

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Too many attempts. Try again in 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    console.log(
      `[LIMITER] hit from ip=${req.ip} xff=${req.headers["x-forwarded-for"]}`,
    );
    return req.ip ?? "unknown";
  },
  handler: (req, res) => {
    console.log(`[LIMITER] BLOCKED ip=${req.ip}`);
    res
      .status(429)
      .json({ error: "Too many attempts. Try again in 15 minutes." });
  },
});

router.post(
  "/register",
  authLimiter,
  validate(RegisterSchema),
  authController.register,
);
router.post("/login", authLimiter, validate(LoginSchema), authController.login);

export default router;
