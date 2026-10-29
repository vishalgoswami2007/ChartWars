import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { ACCESS_TOKEN_TTL } from "../constants/auth.js";

export const signAccessToken = (user) =>
  jwt.sign({ sub: user.id }, env.JWT_ACCESS_SECRET, { expiresIn: ACCESS_TOKEN_TTL });

export const verifyAccessToken = (token) => jwt.verify(token, env.JWT_ACCESS_SECRET);

export const generateOpaqueToken = () => crypto.randomBytes(48).toString("base64url");

export const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

export const fingerprint = (hash) =>
  crypto.createHash("sha256").update(hash || "").digest("hex").slice(0, 16);

export const signResetToken = (user) =>
  jwt.sign({ sub: user.id, ph: fingerprint(user.passwordHash), purpose: "reset" }, env.OTP_SECRET, {
    expiresIn: "10m",
  });

export const verifyResetToken = (token) => {
  const payload = jwt.verify(token, env.OTP_SECRET);
  if (payload.purpose !== "reset") throw new Error("Wrong token type");
  return payload;
};