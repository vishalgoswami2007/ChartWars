import { Router } from "express";
import mongoose from "mongoose";

import { Friendship, pairKeyOf } from "../models/Friendship.js";
import { Message } from "../models/Message.js";
import { User } from "../models/User.js";
import { requireAuth } from "../middleware/require-auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { isOnline } from "../services/presence.js";

const router = Router();
router.use(requireAuth);

const PUBLIC = "username name avatar bio elo stats createdAt"; // email kabhi nahi bhejte
const toPerson = (u) => ({
  id: String(u._id),
  username: u.username || u.name || "Player",
  name: u.name || "",
  avatar: u.avatar || "",
  bio: u.bio || "",
  elo: u.elo,
  matches: u.stats?.played ?? 0,
  wins: u.stats?.won ?? 0,
  joinedAt: u.createdAt,
  online: isOnline(u._id),
});

const bad = (res, status, message) => res.status(status).json({ message });
const notify = (req, userId, event, data) => req.app.get("io").to(`user:${userId}`).emit(event, data);
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const isId = (v) => mongoose.isValidObjectId(v);

// Jin logo se koi relation nahi, wo sab (search ke saath)
router.get("/discover", asyncHandler(async (req, res) => {
  const me = req.user.id;
  const q = String(req.query.q || "").trim().slice(0, 40);

  const rows = await Friendship.find({ $or: [{ requester: me }, { recipient: me }] }).select("requester recipient");
  const taken = rows.map((r) => (String(r.requester) === me ? r.recipient : r.requester));

  const filter = { _id: { $nin: [me, ...taken] } };
  if (q) {
    const re = new RegExp(escapeRe(q), "i");
    filter.$or = [{ username: re }, { name: re }];
  }
  const users = await User.find(filter).select(PUBLIC).sort({ createdAt: -1 }).limit(30);
  res.json({ users: users.map(toPerson) });
}));

// Meri friends list: online status, last message, unread count ke saath
router.get("/", asyncHandler(async (req, res) => {
  const me = req.user.id;
  const rows = await Friendship.find({
    status: "accepted",
    $or: [{ requester: me }, { recipient: me }],
  }).populate("requester recipient", PUBLIC);

  const valid = rows.filter((r) => r.requester && r.recipient);
  const keys = valid.map((r) => r.pairKey);
  const meObj = new mongoose.Types.ObjectId(me);

  const stats = keys.length
    ? await Message.aggregate([
        { $match: { pairKey: { $in: keys } } },
        { $sort: { createdAt: -1 } },
        {
          $group: {
            _id: "$pairKey",
            last: { $first: { text: "$text", from: "$from", at: "$createdAt" } },
            unread: {
              $sum: {
                $cond: [{ $and: [{ $eq: ["$to", meObj] }, { $eq: [{ $ifNull: ["$readAt", null] }, null] }] }, 1, 0],
              },
            },
          },
        },
      ])
    : [];
  const byKey = new Map(stats.map((s) => [s._id, s]));

  const friends = valid
    .map((r) => {
      const other = String(r.requester._id) === me ? r.recipient : r.requester;
      const s = byKey.get(r.pairKey);
      return {
        ...toPerson(other),
        since: r.updatedAt,
        unread: s?.unread ?? 0,
        lastMessage: s ? { text: s.last.text, mine: String(s.last.from) === me, at: s.last.at } : null,
      };
    })
    .sort((a, b) => new Date(b.lastMessage?.at ?? b.since) - new Date(a.lastMessage?.at ?? a.since));

  res.json({ friends });
}));

// Mujhe aayi requests
router.get("/requests", asyncHandler(async (req, res) => {
  const rows = await Friendship.find({ recipient: req.user.id, status: "pending" })
    .populate("requester", PUBLIC)
    .sort({ createdAt: -1 });
  res.json({
    requests: rows.filter((r) => r.requester).map((r) => ({ id: String(r._id), at: r.createdAt, from: toPerson(r.requester) })),
  });
}));

// Maine bheji requests
router.get("/sent", asyncHandler(async (req, res) => {
  const rows = await Friendship.find({ requester: req.user.id, status: "pending" })
    .populate("recipient", PUBLIC)
    .sort({ createdAt: -1 });
  res.json({
    sent: rows.filter((r) => r.recipient).map((r) => ({ id: String(r._id), at: r.createdAt, to: toPerson(r.recipient) })),
  });
}));

router.post("/request", asyncHandler(async (req, res) => {
  const me = req.user.id;
  const target = String(req.body.userId || "");
  if (!isId(target) || target === me) return bad(res, 400, "Invalid user");
  if (!(await User.exists({ _id: target }))) return bad(res, 404, "User not found");

  const key = pairKeyOf(me, target);
  const existing = await Friendship.findOne({ pairKey: key });
  if (existing) {
    if (existing.status === "accepted") return bad(res, 409, "You are already friends");
    if (String(existing.requester) === me) return bad(res, 409, "Request already sent");
    // Samne wale ne pehle hi request bhej rakhi thi, to seedha friends
    existing.status = "accepted";
    await existing.save();
    notify(req, target, "friend:update", {});
    return res.json({ status: "accepted" });
  }

  try {
    const doc = await Friendship.create({ requester: me, recipient: target, pairKey: key });
    notify(req, target, "friend:request", { id: String(doc._id), from: toPerson(req.user) });
    res.status(201).json({ status: "pending" });
  } catch (err) {
    if (err.code === 11000) return bad(res, 409, "Request already sent");
    throw err;
  }
}));

router.post("/respond", asyncHandler(async (req, res) => {
  const { requestId, accept } = req.body;
  if (!isId(requestId)) return bad(res, 400, "Invalid request");
  const doc = await Friendship.findOne({ _id: requestId, recipient: req.user.id, status: "pending" });
  if (!doc) return bad(res, 404, "Request not found");

  if (accept) {
    doc.status = "accepted";
    await doc.save();
    notify(req, doc.requester, "friend:update", {});
  } else {
    await doc.deleteOne(); // reject chupchap, sender ko nahi batate
  }
  res.json({ accepted: Boolean(accept) });
}));

// Unfriend ya bheji hui request cancel
router.delete("/:userId", asyncHandler(async (req, res) => {
  const other = req.params.userId;
  if (!isId(other)) return bad(res, 400, "Invalid user");
  const doc = await Friendship.findOneAndDelete({ pairKey: pairKeyOf(req.user.id, other) });
  if (!doc) return bad(res, 404, "Not found");
  notify(req, other, "friend:update", {});
  res.json({ removed: true });
}));

// Chat history (sirf friends ke saath)
router.get("/:userId/messages", asyncHandler(async (req, res) => {
  const me = req.user.id;
  const other = req.params.userId;
  if (!isId(other)) return bad(res, 400, "Invalid user");

  const key = pairKeyOf(me, other);
  if (!(await Friendship.exists({ pairKey: key, status: "accepted" }))) {
    return bad(res, 403, "You can only view chats with friends");
  }

  const filter = { pairKey: key };
  if (req.query.before) {
    const d = new Date(String(req.query.before));
    if (!Number.isNaN(d.getTime())) filter.createdAt = { $lt: d };
  }
  const rows = await Message.find(filter).sort({ createdAt: -1 }).limit(50);
  await Message.updateMany({ pairKey: key, to: me, readAt: null }, { $set: { readAt: new Date() } });

  res.json({
    messages: rows.reverse().map((m) => ({
      id: String(m._id),
      from: String(m.from),
      to: String(m.to),
      text: m.text,
      at: m.createdAt,
    })),
  });
}));

router.post("/:userId/read", asyncHandler(async (req, res) => {
  const other = req.params.userId;
  if (!isId(other)) return bad(res, 400, "Invalid user");
  await Message.updateMany(
    { pairKey: pairKeyOf(req.user.id, other), to: req.user.id, readAt: null },
    { $set: { readAt: new Date() } }
  );
  res.json({ ok: true });
}));

export default router;