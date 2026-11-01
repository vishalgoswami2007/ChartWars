import { joinQueue, leaveQueue } from "../services/matchmaking.js";
import { isInMatch } from "../services/matchEngine.js";
import { User } from "../models/User.js";

const DURATIONS = [60, 180, 300];

export default function queueHandlers(io, socket) {
  const uid = socket.user.id;

  socket.on("queue:join", async ({ durationSec = 300, country = "" } = {}) => {
    if (!DURATIONS.includes(durationSec)) return socket.emit("queue:error", "Invalid match length");
    if (isInMatch(uid)) return socket.emit("queue:error", "You are already in a match");
    const u = await User.findById(uid).select("elo");
    if (!u) return;
    joinQueue({
      userId: uid,
      username: socket.user.username,
      elo: u.elo,
      durationSec,
      country: String(country).slice(0, 2).toUpperCase(),
    });
    socket.emit("queue:searching");
  });

  socket.on("queue:leave", () => leaveQueue(uid));
  socket.on("disconnect", () => leaveQueue(uid));
}