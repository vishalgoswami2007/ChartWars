import Room from "../models/Room.js";
import uniqueCode from "../utils/roomCode.js";
import { startMatch } from "./matchEngine.js";

const queue = [];
const TIMEOUT_MS = 60000;

export const joinQueue = (entry) => {
  if (!queue.some(q => q.userId === entry.userId)) queue.push({ ...entry, joinedAt: Date.now() });
};
export const leaveQueue = (userId) => {
  const i = queue.findIndex(q => q.userId === userId);
  if (i > -1) queue.splice(i, 1);
};

export function startMatchmaking(io) {
  setInterval(async () => {
    const now = Date.now();
    for (let i = 0; i < queue.length; i++) {
      const a = queue[i];
      const waited = now - a.joinedAt;
      if (waited > TIMEOUT_MS) {
        queue.splice(i, 1);
        io.to(`user:${a.userId}`).emit("queue:timeout", { message: "Koi player nahi mila. Friend ko invite karo." });
        i--; continue;
      }
      const range = 100 + Math.floor(waited / 10000) * 50;   // ±100, har 10 sec me +50
      const j = queue.findIndex((b, k) => k !== i && b.durationSec === a.durationSec && Math.abs(b.elo - a.elo) <= range);
      if (j > -1) {
        const b = queue[j];
        queue.splice(Math.max(i, j), 1);
        queue.splice(Math.min(i, j), 1);
        const room = await Room.create({
          code: await uniqueCode(Room), mode: "online", host: a.userId,
          players: [{ user: a.userId, ready: true }, { user: b.userId, ready: true }],
          maxPlayers: 2, durationSec: a.durationSec,
        });
        [a, b].forEach(x => io.to(`user:${x.userId}`).emit("match:found", { code: room.code }));
        setTimeout(() => startMatch(io, room.code), 4000);
        i = -1;
      }
    }
  }, 2000);
}