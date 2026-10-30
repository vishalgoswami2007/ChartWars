import { Router } from "express";
import * as ctrl from "../controllers/user.controller.js";
import { requireAuth } from "../middleware/require-auth.js";
import { authLimiter } from "../middleware/rate-limit.js";

const router = Router();

router.get("/me", requireAuth, ctrl.getMe);
router.put("/me", requireAuth, ctrl.updateMe);
router.post("/me/password", requireAuth, authLimiter, ctrl.changePassword);
router.delete("/me", requireAuth, authLimiter, ctrl.deleteAccount);
router.get("/username-available", requireAuth, ctrl.usernameAvailable);
router.get("/:key", requireAuth, ctrl.getPublicProfile);

export default router;