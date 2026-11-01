import { Router } from "express";
import Room from "../models/Room.js";
import uniqueCode from "../utils/roomCode.js";
import { roomState } from "../services/roomState.js";
import { requireAuth } from "../middleware/require-auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();
const DURATIONS = [60, 180, 300, 600, 900];
const emitTo = (req, userId, ev, data) => req.app.get("io").to(`user:${userId}`).emit(ev, data);

router.post("/", requireAuth, asyncHandler(async (req, res) => {
  const durationSec = Number(req.body.durationSec ?? 300);
  const maxPlayers = Number(req.body.maxPlayers ?? 2);
  if (!DURATIONS.includes(durationSec) || ![2, 4].includes(maxPlayers)) {
    return res.status(400).json({ message: "Invalid room settings" });
  }
  const room = await Room.create({
    code: await uniqueCode(Room),
    mode: "friends",
    host: req.user.id,
    players: [{ user: req.user.id }],
    durationSec,
    maxPlayers,
  });
  res.status(201).json(room);
}));

router.post("/join", requireAuth, asyncHandler(async (req, res) => {
  const room = await Room.findOne({ code: String(req.body.code || "").toUpperCase() });
  if (!room) return res.status(404).json({ message: "Room not found" });
  const uid = req.user.id;
  if (room.players.some((p) => String(p.user) === uid)) return res.json({ status: "joined" });
  if (room.status !== "waiting") return res.status(400).json({ message: "Match already started" });
  if (room.players.length >= room.maxPlayers) return res.status(400).json({ message: "Room is full" });
  if (!room.pending.some((id) => String(id) === uid)) {
    room.pending.push(uid);
    await room.save();
  }
  emitTo(req, room.host, "room:join-request", {
    code: room.code,
    userId: uid,
    username: req.user.username || req.user.name || "Player",
    elo: req.user.elo,
  });
  res.json({ status: "pending" });
}));

router.post("/approve", requireAuth, asyncHandler(async (req, res) => {
  const { code, userId, accept } = req.body;
  const room = await Room.findOne({ code });
  if (!room || String(room.host) !== req.user.id) {
    return res.status(403).json({ message: "Only the host can do this" });
  }
  const wasPending = room.pending.some((id) => String(id) === userId);
  room.pending = room.pending.filter((id) => String(id) !== userId);
  const accepted =
    Boolean(accept) && wasPending && room.status === "waiting" && room.players.length < room.maxPlayers;
  if (accepted) room.players.push({ user: userId });
  await room.save();

  emitTo(req, userId, "room:join-result", { code, accepted });
  req.app.get("io").to(code).emit("room:state", await roomState(code));
  res.json({ accepted });
}));

router.get("/:code", requireAuth, asyncHandler(async (req, res) => {
  const room = await roomState(req.params.code.toUpperCase());
  if (!room) return res.status(404).json({ message: "Room not found" });
  res.json(room);
}));

export default router;