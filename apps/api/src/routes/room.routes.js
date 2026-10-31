import { Router } from "express";
import Room from "../models/Room.js";
import uniqueCode from "../utils/roomCode.js";
import { requireAuth as protect } from "../middleware/require-auth.js";

const router = Router();
const emitTo = (req, userId, ev, data) => req.app.get("io").to(`user:${userId}`).emit(ev, data);

router.post("/", protect, async (req, res) => {
  const { durationSec = 300, maxPlayers = 2 } = req.body;
  const room = await Room.create({
    code: await uniqueCode(Room), mode: "friends", host: req.user.id,
    players: [{ user: req.user.id }],
    durationSec, maxPlayers: Math.min(Math.max(maxPlayers, 2), 4),
  });
  res.status(201).json(room);
});

router.post("/join", protect, async (req, res) => {
  const room = await Room.findOne({ code: String(req.body.code || "").toUpperCase() });
  if (!room) return res.status(404).json({ message: "Room nahi mila" });
  const uid = req.user.id;
  if (room.players.some(p => String(p.user) === uid)) return res.json({ status: "joined", room });
  if (room.status !== "waiting") return res.status(400).json({ message: "Match shuru ho chuka" });
  if (room.players.length >= room.maxPlayers) return res.status(400).json({ message: "Room full" });
  if (!room.pending.some(id => String(id) === uid)) { room.pending.push(uid); await room.save(); }
  emitTo(req, room.host, "room:join-request", { code: room.code, userId: uid });
  res.json({ status: "pending" });
});

router.post("/approve", protect, async (req, res) => {
  const { code, userId, accept } = req.body;
  const room = await Room.findOne({ code });
  if (!room || String(room.host) !== req.user.id) return res.status(403).json({ message: "Sirf host" });
  room.pending = room.pending.filter(id => String(id) !== userId);
  if (accept && room.players.length < room.maxPlayers && room.status === "waiting")
    room.players.push({ user: userId });
  await room.save();
  emitTo(req, userId, "room:join-result", { code, accepted: !!accept });
  req.app.get("io").to(code).emit("room:state", await room.populate("players.user", "username elo"));
  res.json(room);
});

router.get("/:code", protect, async (req, res) => {
  const room = await Room.findOne({ code: req.params.code.toUpperCase() })
    .populate("players.user", "username elo");
  if (!room) return res.status(404).json({ message: "Room nahi mila" });
  res.json(room);
});

export default router;
