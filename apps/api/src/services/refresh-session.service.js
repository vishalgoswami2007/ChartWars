import crypto from "node:crypto";
import { RefreshSession } from "../models/RefreshSession.js";
import { User } from "../models/User.js";
import { REFRESH_TTL_MS } from "../constants/auth.js";
import { ApiError } from "../utils/ApiError.js";
import { generateOpaqueToken, hashToken } from "./token.service.js";

export async function createSession(user, meta = {}, family = crypto.randomUUID()) {
  const token = generateOpaqueToken();
  await RefreshSession.create({
    user: user.id,
    tokenHash: hashToken(token),
    family,
    expiresAt: new Date(Date.now() + REFRESH_TTL_MS),
    ip: meta.ip,
    userAgent: meta.userAgent,
  });
  return token;
}

// One-time-use refresh tokens. Using an old token again = theft signal -> kill the whole family.
export async function rotateSession(rawToken, meta = {}) {
  const tokenHash = hashToken(rawToken);

  const session = await RefreshSession.findOneAndUpdate(
    { tokenHash, revokedAt: null, expiresAt: { $gt: new Date() } },
    { revokedAt: new Date() }
  );

  if (!session) {
    const old = await RefreshSession.findOne({ tokenHash });
    if (old?.revokedAt) {
      await RefreshSession.updateMany({ family: old.family, revokedAt: null }, { revokedAt: new Date() });
    }
    throw ApiError.unauthorized("Session expired, please login again");
  }

  const user = await User.findById(session.user);
  if (!user) throw ApiError.unauthorized("Session expired, please login again");

  const refreshToken = await createSession(user, meta, session.family);
  return { user, refreshToken };
}

export async function revokeSession(rawToken) {
  await RefreshSession.updateOne({ tokenHash: hashToken(rawToken), revokedAt: null }, { revokedAt: new Date() });
}

export async function revokeAllForUser(userId) {
  await RefreshSession.updateMany({ user: userId, revokedAt: null }, { revokedAt: new Date() });
}