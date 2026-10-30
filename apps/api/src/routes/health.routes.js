import { Router } from "express";
import mongoose from "mongoose";

const router = Router();

// UptimeRobot isko ping karega. Light rakho, DB query mat karo.
router.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: Math.round(process.uptime()),
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    time: new Date().toISOString(),
  });
});

export default router;