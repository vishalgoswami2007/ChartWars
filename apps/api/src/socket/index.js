import { parseCookie } from "cookie";
import { ACCESS_COOKIE } from "../constants/auth.js";
import { verifyAccessToken } from "../services/token.service.js";
import { User } from "../models/User.js";
import roomHandlers from "./roomHandlers.js";
import queueHandlers from "./queueHandlers.js";

export default function initSocket(io) {
  io.use(async (socket, next) => {
    try {
      const cookies = parse(socket.handshake.headers.cookie || "");
      const token = cookies[ACCESS_COOKIE] || socket.handshake.auth?.token;
      if (!token) throw new Error("no token");
      const payload = verifyAccessToken(token);
      const u = await User.findById(payload.sub).select("username elo");
      if (!u) throw new Error("no user");
      socket.user = { id: u.id, username: u.username };
      next();
    } catch {
      next(new Error("unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    socket.join(`user:${socket.user.id}`);
    roomHandlers(io, socket);
    queueHandlers(io, socket);
  });
}