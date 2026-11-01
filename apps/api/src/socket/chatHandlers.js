import mongoose from "mongoose";

import { Friendship, pairKeyOf } from "../models/Friendship.js";
import { Message } from "../models/Message.js";

export default function chatHandlers(io, socket) {
  const me = socket.user.id;
  let windowStart = Date.now();
  let count = 0;

  socket.on("chat:send", async ({ to, text } = {}, ack) => {
    const reply = typeof ack === "function" ? ack : () => {};
    try {
      // 10 sec me max 20 messages, spam rokne ke liye
      if (Date.now() - windowStart > 10000) {
        windowStart = Date.now();
        count = 0;
      }
      if (++count > 20) return reply({ ok: false, error: "You are sending too fast" });

      const body = String(text ?? "").trim();
      if (!mongoose.isValidObjectId(to) || !body) return reply({ ok: false, error: "Invalid message" });
      if (body.length > 1000) return reply({ ok: false, error: "Message is too long" });

      const key = pairKeyOf(me, to);
      if (!(await Friendship.exists({ pairKey: key, status: "accepted" }))) {
        return reply({ ok: false, error: "You can only message friends" });
      }

      const msg = await Message.create({ pairKey: key, from: me, to, text: body });
      const payload = { id: String(msg._id), from: me, to: String(to), text: msg.text, at: msg.createdAt };

      io.to(`user:${to}`).emit("chat:message", payload);
      socket.to(`user:${me}`).emit("chat:message", payload); // mere baaki tabs ke liye
      reply({ ok: true, message: payload });
    } catch (err) {
      console.error("[chat:send]", err.message);
      reply({ ok: false, error: "Could not send the message" });
    }
  });
}