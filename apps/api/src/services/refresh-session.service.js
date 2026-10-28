
import mongoose from "mongoose";
import RefreshSession from "../models/RefreshSession.js";
import {
  createRefreshToken,
  hashRefreshToken,
} from "./token.service.js";
import { env } from "../config/env.js";

function createAuthError(message, code = "INVALID_REFRESH_TOKEN") {
  const error = new Error(message);
  error.statusCode = 401;
  error.code = code;
  return error;
}

function getExpiryDate() {
  const days = env.REFRESH_TOKEN_TTL_DAYS;

  if (!Number.isInteger(days) || days < 1 || days > 30) {
    throw new Error("REFRESH_TOKEN_TTL_DAYS must be between 1 and 30.");
  }

  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

export async function createRefreshSession(userId) {
  if (!mongoose.isValidObjectId(userId)) {
    throw new Error("A valid user ID is required.");
  }

  const token = createRefreshToken();
  const tokenHash = hashRefreshToken(token);
  const expiresAt = getExpiryDate();

  await RefreshSession.create({
    userId,
    tokenHash,
    expiresAt,
  });

  return { token, expiresAt };
}

export async function rotateRefreshSession(token) {
  if (typeof token !== "string" || token.length === 0) {
    throw createAuthError("Invalid refresh token.");
  }

  const oldHash = hashRefreshToken(token);
  const newToken = createRefreshToken();
  const newHash = hashRefreshToken(newToken);
  const expiresAt = getExpiryDate();

  const session = await mongoose.startSession();

  try {
    let userId;

    await session.withTransaction(async () => {
      const current = await RefreshSession.findOne({
        tokenHash: oldHash,
        revokedAt: null,
        expiresAt: { $gt: new Date() },
      }).session(session);

      if (!current) {
        throw createAuthError("Invalid or expired refresh token.");
      }

      const result = await RefreshSession.updateOne(
        {
          _id: current._id,
          revokedAt: null,
          expiresAt: { $gt: new Date() },
        },
        {
          $set: {
            revokedAt: new Date(),
            replacedByTokenHash: newHash,
          },
        },
        { session },
      );

      if (result.modifiedCount !== 1) {
        throw createAuthError("Refresh token has already been used.");
      }

      await RefreshSession.create(
        [
          {
            userId: current.userId,
            tokenHash: newHash,
            expiresAt,
          },
        ],
        { session },
      );

      userId = current.userId.toString();
    });

    return { token: newToken, expiresAt, userId };
  } finally {
    await session.endSession();
  }
}

export async function revokeRefreshSession(token) {
  if (typeof token !== "string" || token.length === 0) {
    return;
  }

  await RefreshSession.updateOne(
    {
      tokenHash: hashRefreshToken(token),
      revokedAt: null,
    },
    {
      $set: { revokedAt: new Date() },
    },
  );
}
