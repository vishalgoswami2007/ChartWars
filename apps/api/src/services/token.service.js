
import jwt from "jsonwebtoken";
import { randomBytes, createHash } from "node:crypto";
import { env } from "../config/env.js";

function getAccessTokenSecret() {
  const secret = env.ACCESS_TOKEN_SECRET;

  if (!secret || Buffer.byteLength(secret, "utf8") < 64) {
    throw new Error(
      "ACCESS_TOKEN_SECRET must contain at least 64 bytes of random secret data.",
    );
  }

  return secret;
}

export function createAccessToken(userId) {
  if (!userId) {
    throw new Error("A user ID is required to create an access token.");
  }

  return jwt.sign(
    { sub: String(userId) },
    getAccessTokenSecret(),
    {
      expiresIn: env.ACCESS_TOKEN_TTL,
      issuer: "chartwars-api",
      audience: "chartwars-web",
    },
  );
}

export function createRefreshToken() {
  return randomBytes(48).toString("base64url");
}

export function hashRefreshToken(token) {
  if (typeof token !== "string" || token.length === 0) {
    throw new Error("A refresh token is required.");
  }

  return createHash("sha256").update(token).digest("hex");
}
