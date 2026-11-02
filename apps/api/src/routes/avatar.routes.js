import express, { Router } from "express";
import mongoose from "mongoose";

import { AvatarImage } from "../models/AvatarImage.js";
import { User } from "../models/User.js";
import { requireAuth } from "../middleware/require-auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

const MAX_BYTES = 200 * 1024; // browser 256x256 JPEG banata hai, wo isse bahut chhota hota hai
const TYPES = ["image/jpeg", "image/png", "image/webp"];

const hasBytes = (buf, bytes, offset = 0) => bytes.every((b, i) => buf[offset + i] === b);

// Header ke pehle bytes se asli type pata karte hain (naam ya Content-Type pe bharosa nahi)
function sniff(buf) {
  if (buf.length < 12) return null;
  if (hasBytes(buf, [0xff, 0xd8, 0xff])) return "image/jpeg";
  if (hasBytes(buf, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return "image/png";
  if (hasBytes(buf, [0x52, 0x49, 0x46, 0x46]) && hasBytes(buf, [0x57, 0x45, 0x42, 0x50], 8)) return "image/webp";
  return null;
}

// Meri photo upload
router.put(
  "/me",
  requireAuth,
  express.raw({ type: TYPES, limit: MAX_BYTES }),
  asyncHandler(async (req, res) => {
    const buf = req.body;
    if (!Buffer.isBuffer(buf) || buf.length === 0) {
      return res.status(415).json({ message: "Send a JPEG, PNG or WebP image" });
    }
    const type = sniff(buf);
    if (!type || type !== String(req.headers["content-type"]).split(";")[0]) {
      return res.status(415).json({ message: "That file is not a valid image" });
    }

    const doc = await AvatarImage.findOneAndUpdate(
      { user: req.user.id },
      { $set: { contentType: type, data: buf }, $inc: { version: 1 } },
      { upsert: true, new: true }
    );

    const url = `${req.protocol}://${req.get("host")}/api/v1/avatars/${req.user.id}?v=${doc.version}`;
    await User.updateOne({ _id: req.user.id }, { $set: { avatar: url } });
    res.json({ avatar: url });
  })
);

// Kisi ki bhi photo dikhane ke liye. Login nahi chahiye, taaki <img> kahin bhi chale.
router.get(
  "/:userId",
  asyncHandler(async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.userId)) return res.status(404).end();
    const doc = await AvatarImage.findOne({ user: req.params.userId }).select("contentType data");
    if (!doc) return res.status(404).end();

    res.set({
      "Content-Type": doc.contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
      // helmet default me same-origin lagata hai, to Vercel wali site ye image nahi dikha paati
      "Cross-Origin-Resource-Policy": "cross-origin",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'",
    });
    res.end(doc.data);
  })
);

export default router;