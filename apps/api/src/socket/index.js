import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import roomHandlers from "./roomHandlers.js";
import queueHandlers from "./queueHandlers.js";

export default function initSocket(io) {
  io.use(async (socket, next) => {
    try {
      const { id } = jwt.verify(socket.handshake.auth.token, process.env.JWT_SECRET);
      const u = await User.findById(id).select("username elo");
      if (!u) throw new Error();
      socket.user = { id, username: u.username };
      next();
    } catch { next(new Error("unauthorized")); }
  });

  io.on("connection", (socket) => {
    socket.join(`user:${socket.user.id}`);
    roomHandlers(io, socket);
    queueHandlers(io, socket);
  });
}
