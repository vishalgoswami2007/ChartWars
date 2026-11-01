import { ACCESS_COOKIE } from "../constants/auth.js";
import { verifyAccessToken } from "../services/token.service.js";
import { User } from "../models/User.js";
import roomHandlers from "./roomHandlers.js";
import queueHandlers from "./queueHandlers.js";

const parseCookie = (header = "") =>
  Object.fromEntries(
    header.split(";").flatMap((part) => {
      const i = part.indexOf("=");
      if (i < 0) return [];
      const raw = part.slice(i + 1).trim();
      let value = raw;
      try {
        value = decodeURIComponent(raw);
      } catch {
        // raw value hi rakh lo
      }
      return [[part.slice(0, i).trim(), value]];
    })
  );

export default function initSocket(io) {
  io.use(async (socket, next) => {
    try {
      const cookies = parseCookie(socket.handshake.headers.cookie);
      const token = cookies[ACCESS_COOKIE] || socket.handshake.auth?.token;
      if (!token) {
        throw new Error(`no access cookie (expected ${ACCESS_COOKIE}, seen: ${Object.keys(cookies).join(", ") || "none"})`);
      }
      const payload = verifyAccessToken(token);
     const u = await User.findById(payload.sub).select("username name elo");
      if (!u) throw new Error("user not found");
      socket.user = { id: u.id, username: u.username || u.name || "Player" };
      next();
    } catch (err) {
      console.log("[socket auth] rejected:", err.message);
      next(new Error("unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    socket.join(`user:${socket.user.id}`);
    roomHandlers(io, socket);
    queueHandlers(io, socket);
  });
}