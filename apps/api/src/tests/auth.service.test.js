
import { beforeEach, describe, expect, it, vi } from "vitest";

const { findOneMock, selectMock, compareMock } = vi.hoisted(() => ({
  findOneMock: vi.fn(),
  selectMock: vi.fn(),
  compareMock: vi.fn(),
}));

vi.mock("../models/User.js", () => ({
  default: {
    findOne: findOneMock,
  },
}));

vi.mock("bcrypt", () => ({
  default: {
    hash: vi.fn(),
    compare: compareMock,
  },
}));

import { loginUser } from "../services/auth.service.js";

describe("loginUser", () => {
  const credentials = {
    email: "Vishal@example.com",
    password: "StrongPassword123",
  };

  const user = {
    _id: { toString: () => "user-id-123" },
    username: "vishal_123",
    email: "vishal@example.com",
    passwordHash: "stored-password-hash",
    createdAt: new Date("2026-10-27T12:00:00.000Z"),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    selectMock.mockResolvedValue(user);
    findOneMock.mockReturnValue({ select: selectMock });
  });

  it("returns a safe user when the password matches", async () => {
    compareMock.mockResolvedValue(true);

    const result = await loginUser(credentials);

    expect(findOneMock).toHaveBeenCalledWith({
      email: "vishal@example.com",
    });
    expect(selectMock).toHaveBeenCalledWith("+passwordHash");
    expect(compareMock).toHaveBeenCalledWith(
      credentials.password,
      user.passwordHash,
    );

    expect(result).toEqual({
      id: "user-id-123",
      username: "vishal_123",
      email: "vishal@example.com",
      createdAt: user.createdAt,
    });

    expect(result).not.toHaveProperty("passwordHash");
  });

  it("rejects an unknown email", async () => {
    selectMock.mockResolvedValue(null);

    await expect(loginUser(credentials)).rejects.toMatchObject({
      statusCode: 401,
      code: "INVALID_CREDENTIALS",
      message: "Invalid email or password.",
    });

    expect(compareMock).not.toHaveBeenCalled();
  });

  it("rejects an incorrect password", async () => {
    compareMock.mockResolvedValue(false);

    await expect(loginUser(credentials)).rejects.toMatchObject({
      statusCode: 401,
      code: "INVALID_CREDENTIALS",
      message: "Invalid email or password.",
    });
  });
});
