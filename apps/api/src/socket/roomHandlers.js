import Room from "../models/Room.js";
import { startMatch, trade, matches, viewFor } from "../services/matchEngine.js";

export default function roomHandlers(io, socket) {
  const uid = socket.user.id;

  socket.on("room:join", async ({ code }) => {
    const room = await Room.findOne({ code }).populate("players.user", "username elo");
    if (!room || !room.players.some(p => p.user.id === uid)) return socket.emit("room:error", "Allowed nahi");
    socket.join(code);
    socket.emit("room:state", room);
    const m = matches.get(code);
    if (m) socket.emit("match:update", viewFor(m, uid));
  });

  socket.on("room:ready", async ({ code, ready }) => {
    const room = await Room.findOne({ code });
    const p = room?.players.find(x => String(x.user) === uid);
    if (!p || room.status !== "waiting") return;
    p.ready = !!ready;
    await room.save();
    io.to(code).emit("room:state", await room.populate("players.user", "username elo"));
  });

  socket.on("room:start", async ({ code }) => {
    const room = await Room.findOne({ code });
    if (!room || String(room.host) !== uid) return socket.emit("room:error", "Sirf host start kar sakta hai");
    if (room.players.length < 2) return socket.emit("room:error", "Kam se kam 2 players chahiye");
    if (!room.players.every(p => p.ready || String(p.user) === uid)) return socket.emit("room:error", "Sab ready nahi hain");
    await startMatch(io, code);
  });

  socket.on("trade:buy", ({ code, amount }) => {
    const e = trade(io, uid, code, "buy", amount);
    if (e) socket.emit("trade:error", e);
  });
  socket.on("trade:sell", ({ code, amount }) => {
    const e = trade(io, uid, code, "sell", amount);
    if (e) socket.emit("trade:error", e);
  });
}
