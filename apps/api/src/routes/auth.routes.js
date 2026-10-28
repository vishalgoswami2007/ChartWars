import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { requireAuth } from "../middleware/require-auth.js";
import { signupSchema, loginSchema } from "../validators/auth.validator.js";
import {
  signup,
  login,
  refresh,
  logout,
  me,
} from "../controllers/auth.controller.js";

const router = Router();

router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/me", requireAuth, me);

export default router;