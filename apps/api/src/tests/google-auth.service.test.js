
import { beforeEach, describe, expect, it, vi } from "vitest";

const { verifyIdTokenMock } = vi.hoisted(() => ({
  verifyIdTokenMock: vi.fn(),
}));


vi.mock("google-auth-library", () => ({
  OAuth2Client: class {
    verifyIdToken(...args) {
      return verifyIdTokenMock(...args);
    }
  },
}));


vi.mock("../config/env.js", () => ({
  env: {
    GOOGLE_CLIENT_ID: "test-google-client-id",
  },
}));

import { verifyGoogleIdToken } from "../services/google-auth.service.js";

describe("verifyGoogleIdToken", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("verifies a valid token and returns a safe Google profile", async () => {
    verifyIdTokenMock.mockResolvedValue({
      getPayload: () => ({
        sub: "google-user-123",
        email: "Vishal@example.com",
        email_verified: true,
        name: "Vishal Goswami",
        picture: "https://example.com/profile.jpg",
      }),
    });

    const result = await verifyGoogleIdToken("valid-google-id-token");

    expect(verifyIdTokenMock).toHaveBeenCalledWith({
      idToken: "valid-google-id-token",
      audience: "test-google-client-id",
    });

    expect(result).toEqual({
      googleId: "google-user-123",
      email: "vishal@example.com",
      emailVerified: true,
      name: "Vishal Goswami",
      picture: "https://example.com/profile.jpg",
    });
  });

  it("rejects an empty ID token", async () => {
    await expect(verifyGoogleIdToken(" ")).rejects.toMatchObject({
      statusCode: 400,
      code: "GOOGLE_ID_TOKEN_REQUIRED",
    });

    expect(verifyIdTokenMock).not.toHaveBeenCalled();
  });

  it("rejects an invalid or expired Google token", async () => {
    verifyIdTokenMock.mockRejectedValue(new Error("Invalid token"));

    await expect(
      verifyGoogleIdToken("invalid-google-id-token"),
    ).rejects.toMatchObject({
      statusCode: 401,
      code: "INVALID_GOOGLE_TOKEN",
    });
  });

  it("rejects an account without a verified email", async () => {
    verifyIdTokenMock.mockResolvedValue({
      getPayload: () => ({
        sub: "google-user-123",
        email: "vishal@example.com",
        email_verified: false,
      }),
    });

    await expect(
      verifyGoogleIdToken("unverified-email-token"),
    ).rejects.toMatchObject({
      statusCode: 401,
      code: "GOOGLE_EMAIL_NOT_VERIFIED",
    });
  });

  it("rejects a token with a missing payload", async () => {
    verifyIdTokenMock.mockResolvedValue({
      getPayload: () => undefined,
    });

    await expect(
      verifyGoogleIdToken("token-without-payload"),
    ).rejects.toMatchObject({
      statusCode: 401,
      code: "GOOGLE_EMAIL_NOT_VERIFIED",
    });
  });
});
