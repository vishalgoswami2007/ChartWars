import { joinQueue, leaveQueue } from "../services/matchmaking.js";
import { isInMatch } from "../services/matchEngine.js";
import User from "../models/User.js";

export default function queueHandlers(io, socket) {
  const uid = socket.user.id;

  socket.on("queue:join", async ({ durationSec = 300 }) => {
    if (![60, 300].includes(durationSec)) return;
    if (isInMatch(uid)) return socket.emit("queue:error", "Tum match me ho");
    const u = await User.findById(uid).select("elo");
    joinQueue({ userId: uid, elo: u.elo, durationSec });
    socket.emit("queue:searching");
  });

  socket.on("queue:leave", () => leaveQueue(uid));
  socket.on("disconnect", () => leaveQueue(uid));
}