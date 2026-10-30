import { Router } from "express";
import * as ctrl from "../controllers/wallet.controller.js";
import { requireAuth } from "../middleware/require-auth.js";

const router = Router();
router.get("/", requireAuth, ctrl.get);
router.get("/transactions", requireAuth, ctrl.transactions);
router.post("/reset", requireAuth, ctrl.reset);
export default router;