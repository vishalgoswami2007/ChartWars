import { Router } from "express";

import { User } from "../models/User.js";
import { requireAuth } from "../middleware/require-auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { isOnline } from "../services/presence.js";

const router = Router();
router.use(requireAuth);

// ELO zyada, phir wins, phir matches, phir jo pehle aaya
const SORT = { elo: -1, "stats.won": -1, "stats.played": -1, createdAt: 1 };
const FIELDS = "username name avatar elo balance stats createdAt"; // email kabhi nahi

const toRow = (u, rank) => {
  const played = u.stats?.played ?? 0;
  const won = u.stats?.won ?? 0;
  return {
    rank,
    id: String(u._id),
    username: u.username || u.name || "Player",
    name: u.name || "",
    avatar: u.avatar || "",
    elo: u.elo ?? 100,
    balance: u.balance ?? 0,
    matches: played,
    wins: won,
    losses: Math.max(0, played - won),
    winRate: played > 0 ? Math.round((won / played) * 100) : 0,
    online: isOnline(u._id),
  };
};

router.get("/", asyncHandler(async (req, res) => {
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 100, 1), 200);

  const [rows, total] = await Promise.all([
    User.find().select(FIELDS).sort(SORT).limit(limit).lean(),
    User.countDocuments(),
  ]);
  const players = rows.map((u, i) => toRow(u, i + 1));

  // Mera rank: top list me hoon to wahi se, warna ginti se nikalo
  const meDoc = req.user;
  let me = players.find((p) => p.id === String(meDoc._id));
  if (!me) {
    const elo = meDoc.elo ?? 100;
    const won = meDoc.stats?.won ?? 0;
    const played = meDoc.stats?.played ?? 0;
    const ahead = await User.countDocuments({
      $or: [
        { elo: { $gt: elo } },
        { elo, "stats.won": { $gt: won } },
        { elo, "stats.won": won, "stats.played": { $gt: played } },
        { elo, "stats.won": won, "stats.played": played, createdAt: { $lt: meDoc.createdAt } },
      ],
    });
    me = toRow(meDoc, ahead + 1);
  }

  res.json({ players, me, total });
}));

export default router;