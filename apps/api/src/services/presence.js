import { Friendship } from "../models/Friendship.js";

const sockets = new Map(); // userId -> Set(socketId). Ek user ke kai tabs ho sakte hain.

export const isOnline = (id) => sockets.has(String(id));

async function friendIds(userId) {
  const rows = await Friendship.find({
    status: "accepted",
    $or: [{ requester: userId }, { recipient: userId }],
  }).select("requester recipient");
  return rows.map((r) => (String(r.requester) === String(userId) ? String(r.recipient) : String(r.requester)));
}

async function broadcast(io, userId, online) {
  try {
    for (const id of await friendIds(userId)) {
      io.to(`user:${id}`).emit("presence:update", { userId: String(userId), online });
    }
  } catch (err) {
    console.error("[presence]", err.message);
  }
}

export function trackConnect(io, socket) {
  const id = String(socket.user.id);
  const set = sockets.get(id) ?? new Set();
  const first = set.size === 0;
  set.add(socket.id);
  sockets.set(id, set);
  if (first) broadcast(io, id, true);

  socket.on("disconnect", () => {
    const current = sockets.get(id);
    if (!current) return;
    current.delete(socket.id);
    if (current.size === 0) {
      sockets.delete(id);
      // Page refresh pe dot flicker na kare, isliye 3 sec ka grace
      setTimeout(() => {
        if (!sockets.has(id)) broadcast(io, id, false);
      }, 3000);
    }
  });
}