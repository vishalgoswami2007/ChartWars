import { Router } from "express";
import * as ctrl from "../controllers/user.controller.js";
// yahan wahi auth middleware import kar jo /auth/me route pe laga hai
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/me", requireAuth, ctrl.getMe);
router.put("/me", requireAuth, ctrl.updateMe);
router.get("/:userCode", requireAuth, ctrl.getPublicProfile); // /me ke NEECHE rakhna

export default router;