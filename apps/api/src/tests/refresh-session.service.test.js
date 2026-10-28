
import { beforeEach, describe, expect, it, vi } from "vitest";
import mongoose from "mongoose";

const {
  createMock,
  findOneMock,
  updateOneMock,
  createRefreshTokenMock,
  hashRefreshTokenMock,
} = vi.hoisted(() => ({
  createMock: vi.fn(),
  findOneMock: vi.fn(),
  updateOneMock: vi.fn(),
  createRefreshTokenMock: vi.fn(),
  hashRefreshTokenMock: vi.fn(),
}));

vi.mock("../models/RefreshSession.js", () => ({
  default: {
    create: createMock,
    findOne: findOneMock,
    updateOne: updateOneMock,
  },
}));

vi.mock("../services/token.service.js", () => ({
  createRefreshToken: createRefreshTokenMock,
  hashRefreshToken: hashRefreshTokenMock,
}));

import {
  createRefreshSession,
  rotateRefreshSession,
  revokeRefreshSession,
} from "../services/refresh-session.service.js";

describe("refresh-session service", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    createRefreshTokenMock
      .mockReturnValueOnce("new-refresh-token")
      .mockReturnValue("another-refresh-token");

    hashRefreshTokenMock.mockImplementation((token) => `hash:${token}`);
    createMock.mockResolvedValue([]);
    updateOneMock.mockResolvedValue({ modifiedCount: 1 });
  });

  it("creates a session using only the token hash", async () => {
    const userId = new mongoose.Types.ObjectId().toString();

    const result = await createRefreshSession(userId);

    expect(result.token).toBe("new-refresh-token");
    expect(result.expiresAt).toBeInstanceOf(Date);
    expect(createMock).toHaveBeenCalledWith(
      expect.objectContaining({
        userId,
        tokenHash: "hash:new-refresh-token",
        expiresAt: expect.any(Date),
      }),
    );
  });

  it("rejects an invalid user ID", async () => {
    await expect(createRefreshSession("not-an-object-id")).rejects.toThrow(
      "A valid user ID is required.",
    );
  });

  it("revokes a session by its token hash", async () => {
    await revokeRefreshSession("existing-token");

    expect(updateOneMock).toHaveBeenCalledWith(
      {
        tokenHash: "hash:existing-token",
        revokedAt: null,
      },
      {
        $set: { revokedAt: expect.any(Date) },
      },
    );
  });

  it("does nothing when revoking an empty token", async () => {
    await revokeRefreshSession("");

    expect(updateOneMock).not.toHaveBeenCalled();
  });

  it("rejects an empty token during rotation", async () => {
    await expect(rotateRefreshSession("")).rejects.toMatchObject({
      statusCode: 401,
      code: "INVALID_REFRESH_TOKEN",
    });
  });
});

