import mongoose from "mongoose";
import { Match } from "../models/Match.js";
import { ApiError } from "../utils/ApiError.js";

const shape = (m, userId) => {
  const me = m.players.find((p) => String(p.user) === String(userId));
  return {
    id: m._id,
    mode: m.mode,
    endedAt: m.endedAt,
    result: me?.result,
    pnl: me?.pnl ?? 0,
    eloChange: me ? (me.eloAfter ?? 0) - (me.eloBefore ?? 0) : 0,
    opponents: m.players
      .filter((p) => String(p.user) !== String(userId))
      .map((p) => ({ name: p.name, username: p.username, elo: p.eloBefore })),
  };
};

export async function listMine(userId, { before, limit = 20 }) {
  if (before && !mongoose.isValidObjectId(before)) throw ApiError.badRequest("Invalid cursor");
  const lim = Math.min(Math.max(Number(limit) || 20, 1), 50);
  const q = { "players.user": userId, status: "finished" };
  if (before) q._id = { $lt: before };
  const rows = await Match.find(q).sort({ _id: -1 }).limit(lim + 1).lean();
  const hasMore = rows.length > lim;
  const items = (hasMore ? rows.slice(0, lim) : rows).map((m) => shape(m, userId));
  return { items, nextCursor: hasMore ? items[items.length - 1].id : null };
}

export async function getOne(userId, matchId) {
  if (!mongoose.isValidObjectId(matchId)) throw ApiError.notFound("Match not found");
  const m = await Match.findOne({ _id: matchId, "players.user": userId }).lean();
  if (!m) throw ApiError.notFound("Match not found"); // participant nahi to 404, leak nahi
  return { ...shape(m, userId), players: m.players, startedAt: m.startedAt };
}