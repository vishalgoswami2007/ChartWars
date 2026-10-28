
import { afterEach, describe, expect, it, vi } from "vitest";
import jwt from "jsonwebtoken";

vi.mock("../config/env.js", () => ({
  env: {
    ACCESS_TOKEN_SECRET: "a".repeat(64),
    ACCESS_TOKEN_TTL: "15m",
    REFRESH_TOKEN_TTL_DAYS: 7,
  },
}));

import {
  createAccessToken,
  createRefreshToken,
  hashRefreshToken,
} from "../services/token.service.js";

describe("token service", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("creates a signed access token with the expected claims", () => {
    const token = createAccessToken("user-123");

    const decoded = jwt.verify(token, "a".repeat(64), {
      issuer: "chartwars-api",
      audience: "chartwars-web",
    });

    expect(decoded.sub).toBe("user-123");
    expect(decoded.exp - decoded.iat).toBe(15 * 60);
  });

  it("rejects an empty user ID", () => {
    expect(() => createAccessToken("")).toThrow(
      "A user ID is required to create an access token.",
    );
  });

  it("creates unique opaque refresh tokens", () => {
    const first = createRefreshToken();
    const second = createRefreshToken();

    expect(first).not.toBe(second);
    expect(first).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(first.length).toBeGreaterThanOrEqual(60);
  });

  it("hashes a refresh token consistently", () => {
    const token = createRefreshToken();

    expect(hashRefreshToken(token)).toBe(hashRefreshToken(token));
    expect(hashRefreshToken(token)).toMatch(/^[a-f0-9]{64}$/);
  });

  it("rejects an empty refresh token", () => {
    expect(() => hashRefreshToken("")).toThrow(
      "A refresh token is required.",
    );
  });
});
