
import { beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";

const {
  signupUserMock,
  loginUserMock,
  createAccessTokenMock,
  createRefreshSessionMock,
  rotateRefreshSessionMock,
  revokeRefreshSessionMock,
} = vi.hoisted(() => ({
  signupUserMock: vi.fn(),
  loginUserMock: vi.fn(),
  createAccessTokenMock: vi.fn(),
  createRefreshSessionMock: vi.fn(),
  rotateRefreshSessionMock: vi.fn(),
  revokeRefreshSessionMock: vi.fn(),
}));

vi.mock("../services/auth.service.js", () => ({
  signupUser: signupUserMock,
  loginUser: loginUserMock,
}));

vi.mock("../services/token.service.js", () => ({
  createAccessToken: createAccessTokenMock,
}));

vi.mock("../services/refresh-session.service.js", () => ({
  createRefreshSession: createRefreshSessionMock,
  rotateRefreshSession: rotateRefreshSessionMock,
  revokeRefreshSession: revokeRefreshSessionMock,
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

    createAccessTokenMock.mockReturnValue("test-access-token");

    createRefreshSessionMock.mockResolvedValue({
      token: "test-refresh-token",
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    rotateRefreshSessionMock.mockResolvedValue({
      userId: "user-123",
      token: "rotated-refresh-token",
    });

    revokeRefreshSessionMock.mockResolvedValue(undefined);
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
});
