import Room from "../models/Room.js";
import User from "../models/User.js";
import { getPrice } from "./priceFeed.js";
import { eloChanges } from "./elo.js";

const START_BALANCE = 10000;
export const matches = new Map();
const inMatch = new Set();

export const isInMatch = (id) => inMatch.has(id);
const valueOf = (p, price) => p.cash + p.qty * price;

// Online me opponent hidden, friends me sab visible
export function viewFor(m, userId) {
  const price = getPrice();
  const list = Object.values(m.players)
    .filter(p => m.mode === "friends" || p.id === userId)
    .map(p => ({ id: p.id, username: p.username, cash: p.cash, qty: p.qty, value: valueOf(p, price) }));
  return { code: m.code, status: m.status, price, endsAt: m.endsAt, players: list };
}

function broadcast(io, m) {
  for (const id of Object.keys(m.players)) io.to(`user:${id}`).emit("match:update", viewFor(m, id));
}

export async function startMatch(io, code) {
  if (matches.has(code)) return;
  const room = await Room.findOne({ code }).populate("players.user", "username elo");
  if (!room || room.status !== "waiting") return;

  const m = { code, mode: room.mode, players: {}, status: "countdown", durationSec: room.durationSec };
  for (const p of room.players) {
    m.players[p.user.id] = { id: p.user.id, username: p.user.username, elo: p.user.elo, cash: START_BALANCE, qty: 0 };
    inMatch.add(p.user.id);
  }
  matches.set(code, m);
  room.status = "live";
  await room.save();

  io.to(code).emit("match:countdown", { seconds: 3 });
  setTimeout(() => {
    m.status = "live";
    m.endsAt = Date.now() + m.durationSec * 1000;
    io.to(code).emit("match:start", { endsAt: m.endsAt });
    m.ticker = setInterval(() => broadcast(io, m), 1000);
    m.timer = setTimeout(() => endMatch(io, code), m.durationSec * 1000);
  }, 3000);
}

export function trade(io, userId, code, side, amount) {
  const m = matches.get(code);
  const p = m?.players[userId];
  if (!m || m.status !== "live" || !p) return "Match live nahi hai";
  amount = Number(amount);
  if (!(amount > 0)) return "Amount galat hai";
  const price = getPrice();
  if (side === "buy") {
    if (amount > p.cash) return "Balance kam hai";
    p.cash -= amount; p.qty += amount / price;
  } else {
    amount = Math.min(amount, p.qty * price);
    if (amount <= 0) return "Bechne ko kuch nahi";
    p.cash += amount; p.qty -= amount / price;
  }
  io.to(`user:${userId}`).emit("match:update", viewFor(m, userId));
  return null;
}

export async function endMatch(io, code) {
  const m = matches.get(code);
  if (!m || m.status === "ended") return;
  m.status = "ended";
  clearInterval(m.ticker); clearTimeout(m.timer);

  const price = getPrice();
  const results = Object.values(m.players)
    .map(p => ({ id: p.id, username: p.username, elo: p.elo, value: valueOf(p, price) }))
    .sort((a, b) => b.value - a.value);
  const changes = m.mode === "online" ? eloChanges(results) : {};

  const room = await Room.findOne({ code });
  room.status = "finished";
  room.winner = results[0].id;
  room.players.forEach(rp => {
    const r = results.find(x => x.id === String(rp.user));
    rp.finalValue = r.value;
    rp.eloChange = changes[r.id] || 0;
  });
  await room.save();

  for (const r of results) {
    if (changes[r.id] !== undefined) {
      const u = await User.findById(r.id);
      u.elo = Math.max(0, u.elo + changes[r.id]);
      await u.save();
    }
    inMatch.delete(r.id);
  }
  io.to(code).emit("match:end", {
    winner: results[0].id,
    results: results.map(r => ({ ...r, eloChange: changes[r.id] || 0 })),
  });
  matches.delete(code);
}