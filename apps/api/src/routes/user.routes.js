import { Router } from "express";
import * as ctrl from "../controllers/user.controller.js";
import { requireAuth } from "../middleware/require-auth.js";

const router = Router();

router.get("/me", requireAuth, ctrl.getMe);
router.put("/me", requireAuth, ctrl.updateMe);
router.get("/:userCode", requireAuth, ctrl.getPublicProfile); // /me ke NEECHE hi rehna chahiye

export default router;