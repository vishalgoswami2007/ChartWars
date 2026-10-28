
import { beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";

const {
  signupUserMock,
  loginUserMock,
  googleLoginUserMock,
  createAccessTokenMock,
  verifyAccessTokenMock,
  createRefreshSessionMock,
  rotateRefreshSessionMock,
  revokeRefreshSessionMock,
  userFindByIdMock,
  userLeanMock,
} = vi.hoisted(() => ({
  signupUserMock: vi.fn(),
  loginUserMock: vi.fn(),
  googleLoginUserMock: vi.fn(),
  createAccessTokenMock: vi.fn(),
  verifyAccessTokenMock: vi.fn(),
  createRefreshSessionMock: vi.fn(),
  rotateRefreshSessionMock: vi.fn(),
  revokeRefreshSessionMock: vi.fn(),
  userFindByIdMock: vi.fn(),
  userLeanMock: vi.fn(),
}));

vi.mock("../services/auth.service.js", () => ({
  signupUser: signupUserMock,
  loginUser: loginUserMock,
  googleLoginUser: googleLoginUserMock,

}));

vi.mock("../services/token.service.js", () => ({
  createAccessToken: createAccessTokenMock,
  verifyAccessToken: verifyAccessTokenMock,
}));

vi.mock("../services/refresh-session.service.js", () => ({
  createRefreshSession: createRefreshSessionMock,
  rotateRefreshSession: rotateRefreshSessionMock,
  revokeRefreshSession: revokeRefreshSessionMock,
}));

vi.mock("../models/User.js", () => ({
  default: {
    findById: userFindByIdMock,
  },
}));

import app from "../app.js";

describe("Auth routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    signupUserMock.mockResolvedValue({
      id: "user-123",
      username: "vishal_dev",
      email: "vishal@example.com",
    });

    loginUserMock.mockResolvedValue({
      id: "user-123",
      username: "vishal_dev",
      email: "vishal@example.com",
    });

      googleLoginUserMock.mockResolvedValue({
    id: "google-user-123",
    username: "vishal1234",
    email: "vishal@example.com",
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
  });

    createAccessTokenMock.mockReturnValue("test-access-token");

    verifyAccessTokenMock.mockReturnValue({
      sub: "user-123",
    });

    createRefreshSessionMock.mockResolvedValue({
      token: "test-refresh-token",
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    rotateRefreshSessionMock.mockResolvedValue({
      userId: "user-123",
      token: "rotated-refresh-token",
    });

    revokeRefreshSessionMock.mockResolvedValue(undefined);

    userFindByIdMock.mockReturnValue({
      select: vi.fn().mockReturnValue({
        lean: userLeanMock,
      }),
    });

    userLeanMock.mockResolvedValue({
      _id: "user-123",
      username: "vishal_dev",
      email: "vishal@example.com",
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
    });
  });

  it("logs in with Google and sets authentication cookies", async () => {
  const response = await request(app)
    .post("/api/v1/auth/google")
    .send({ idToken: "mock-google-id-token" });

  expect(response.status).toBe(200);
  expect(response.body.success).toBe(true);
  expect(response.body.message).toBe("Google login successful.");

  expect(googleLoginUserMock).toHaveBeenCalledWith({
    idToken: "mock-google-id-token",
  });

  expect(createAccessTokenMock).toHaveBeenCalledWith(
    "google-user-123",
  );
  expect(createRefreshSessionMock).toHaveBeenCalledWith(
    "google-user-123",
  );

  const cookies = response.headers["set-cookie"].join("; ");

  expect(cookies).toContain("cw_access=");
  expect(cookies).toContain("cw_refresh=");
  expect(cookies.toLowerCase()).toContain("httponly");
});

it("rejects Google login when the ID token is missing", async () => {
  const response = await request(app)
    .post("/api/v1/auth/google")
    .send({});

  expect(response.status).toBe(400);
  expect(googleLoginUserMock).not.toHaveBeenCalled();
});

it("returns an error when Google login service rejects the token", async () => {
  googleLoginUserMock.mockRejectedValue(
    Object.assign(
      new Error("Google ID token is invalid or expired."),
      {
        statusCode: 401,
        code: "INVALID_GOOGLE_TOKEN",
      },
    ),
  );

  const response = await request(app)
    .post("/api/v1/auth/google")
    .send({ idToken: "invalid-google-id-token" });

  expect(response.status).toBe(401);
  expect(googleLoginUserMock).toHaveBeenCalledWith({
    idToken: "invalid-google-id-token",
  });
});

  it("creates an account with valid signup data", async () => {
    const response = await request(app)
      .post("/api/v1/auth/signup")
      .send({
        username: "vishal_dev",
        email: "Vishal@example.com",
        password: "StrongPassword123!",
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(signupUserMock).toHaveBeenCalledWith({
      username: "vishal_dev",
      email: "vishal@example.com",
      password: "StrongPassword123!",
    });
  });

  it("rejects invalid signup data", async () => {
    const response = await request(app)
      .post("/api/v1/auth/signup")
      .send({
        username: "ab",
        email: "invalid-email",
        password: "short",
      });

    expect(response.status).toBe(400);
    expect(signupUserMock).not.toHaveBeenCalled();
  });

  it("logs in and sets authentication cookies", async () => {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: "Vishal@example.com",
        password: "StrongPassword123!",
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Login successful.");

    expect(createAccessTokenMock).toHaveBeenCalledWith("user-123");
    expect(createRefreshSessionMock).toHaveBeenCalledWith("user-123");

    const cookies = response.headers["set-cookie"].join("; ");

    expect(cookies).toContain("cw_access=");
    expect(cookies).toContain("cw_refresh=");
    expect(cookies.toLowerCase()).toContain("httponly");
  });

  it("rejects invalid login data", async () => {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: "not-an-email",
        password: "",
      });

    expect(response.status).toBe(400);
    expect(loginUserMock).not.toHaveBeenCalled();
  });

  it("refreshes a session using the refresh cookie", async () => {
    const response = await request(app)
      .post("/api/v1/auth/refresh")
      .set("Cookie", "cw_refresh=old-refresh-token");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Session refreshed successfully.");

    expect(rotateRefreshSessionMock).toHaveBeenCalledWith(
      "old-refresh-token",
    );
    expect(createAccessTokenMock).toHaveBeenCalledWith("user-123");

    const cookies = response.headers["set-cookie"].join("; ");

    expect(cookies).toContain("cw_access=");
    expect(cookies).toContain("cw_refresh=");
  });

  it("rejects refresh when the refresh cookie is missing", async () => {
    const response = await request(app)
      .post("/api/v1/auth/refresh");

    expect(response.status).toBe(401);
    expect(rotateRefreshSessionMock).not.toHaveBeenCalled();
  });

  it("logs out, revokes the refresh session, and clears cookies", async () => {
    const response = await request(app)
      .post("/api/v1/auth/logout")
      .set("Cookie", "cw_refresh=existing-refresh-token");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Logout successful.");

    expect(revokeRefreshSessionMock).toHaveBeenCalledWith(
      "existing-refresh-token",
    );

    const cookies = response.headers["set-cookie"].join("; ");

    expect(cookies).toContain("cw_access=");
    expect(cookies).toContain("cw_refresh=");
    expect(cookies).toContain("Expires=");
  });

  it("logs out successfully when the refresh cookie is missing", async () => {
    const response = await request(app)
      .post("/api/v1/auth/logout");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(revokeRefreshSessionMock).not.toHaveBeenCalled();

    const cookies = response.headers["set-cookie"].join("; ");

    expect(cookies).toContain("cw_access=");
    expect(cookies).toContain("cw_refresh=");
  });

  it("returns the current user's profile with a valid access token", async () => {
    const response = await request(app)
      .get("/api/v1/auth/me")
      .set("Cookie", "cw_access=valid-access-token");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.user).toMatchObject({
      id: "user-123",
      username: "vishal_dev",
      email: "vishal@example.com",
    });

    expect(verifyAccessTokenMock).toHaveBeenCalledWith(
      "valid-access-token",
    );
    expect(userFindByIdMock).toHaveBeenCalledWith("user-123");
  });

  it("rejects the current-user request when the access cookie is missing", async () => {
    const response = await request(app)
      .get("/api/v1/auth/me");

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("UNAUTHORIZED");

    expect(verifyAccessTokenMock).not.toHaveBeenCalled();
    expect(userFindByIdMock).not.toHaveBeenCalled();
  });

  it("rejects an invalid access token", async () => {
    verifyAccessTokenMock.mockImplementation(() => {
      throw new Error("Invalid or expired token.");
    });

    const response = await request(app)
      .get("/api/v1/auth/me")
      .set("Cookie", "cw_access=invalid-access-token");

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("INVALID_ACCESS_TOKEN");

    expect(userFindByIdMock).not.toHaveBeenCalled();
  });
});
