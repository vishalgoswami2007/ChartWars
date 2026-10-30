import { Router } from "express";
import * as ctrl from "../controllers/match.controller.js";
import { requireAuth } from "../middleware/require-auth.js";

const router = Router();
router.get("/mine", requireAuth, ctrl.mine);
router.get("/:id", requireAuth, ctrl.one);
export default router;