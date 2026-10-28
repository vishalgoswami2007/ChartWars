
import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  findOneMock,
  selectMock,
  compareMock,
  createMock,
  existsMock,
  verifyGoogleIdTokenMock,
} = vi.hoisted(() => ({
  findOneMock: vi.fn(),
  selectMock: vi.fn(),
  compareMock: vi.fn(),
  createMock: vi.fn(),
  existsMock: vi.fn(),
  verifyGoogleIdTokenMock: vi.fn(),
}));

vi.mock("../models/User.js", () => ({
  default: {
    findOne: findOneMock,
    create: createMock,
    exists: existsMock,
  },
}));

vi.mock("bcrypt", () => ({
  default: {
    hash: vi.fn(),
    compare: compareMock,
  },
}));

vi.mock("../services/google-auth.service.js", () => ({
  verifyGoogleIdToken: verifyGoogleIdTokenMock,
}));

import {
  loginUser,
  googleLoginUser,
} from "../services/auth.service.js";

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

describe("googleLoginUser", () => {
  const googleProfile = {
    googleId: "google-user-123",
    email: "vishal@example.com",
    emailVerified: true,
    name: "Vishal Goswami",
    picture: "https://example.com/profile.jpg",
  };

  const existingGoogleUser = {
    _id: { toString: () => "google-user-123" },
    username: "vishal1234",
    email: "vishal@example.com",
    googleId: "google-user-123",
    createdAt: new Date("2026-10-27T12:00:00.000Z"),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    verifyGoogleIdTokenMock.mockResolvedValue(googleProfile);
    existsMock.mockResolvedValue(false);
  });

  it("creates a new user for a verified Google account", async () => {
    findOneMock
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);

    createMock.mockResolvedValue(existingGoogleUser);

    const result = await googleLoginUser({
      idToken: "valid-google-id-token",
    });

    expect(verifyGoogleIdTokenMock).toHaveBeenCalledWith(
      "valid-google-id-token",
    );
    expect(findOneMock).toHaveBeenNthCalledWith(1, {
      googleId: googleProfile.googleId,
    });
    expect(findOneMock).toHaveBeenNthCalledWith(2, {
      email: googleProfile.email,
    });
    expect(createMock).toHaveBeenCalledWith(
      expect.objectContaining({
        email: googleProfile.email,
        googleId: googleProfile.googleId,
        profilePicture: googleProfile.picture,
      }),
    );

    expect(result).toEqual({
      id: "google-user-123",
      username: "vishal1234",
      email: "vishal@example.com",
      createdAt: existingGoogleUser.createdAt,
    });
    expect(result).not.toHaveProperty("googleId");
  });

  it("links a verified Google account to an existing email account", async () => {
    const saveMock = vi.fn().mockResolvedValue(undefined);

    const existingEmailUser = {
      ...existingGoogleUser,
      googleId: undefined,
      profilePicture: null,
      save: saveMock,
    };

    findOneMock
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(existingEmailUser);

    const result = await googleLoginUser({
      idToken: "valid-google-id-token",
    });

    expect(existingEmailUser.googleId).toBe(googleProfile.googleId);
    expect(existingEmailUser.profilePicture).toBe(googleProfile.picture);
    expect(saveMock).toHaveBeenCalledOnce();
    expect(createMock).not.toHaveBeenCalled();

    expect(result.id).toBe("google-user-123");
    expect(result.email).toBe("vishal@example.com");
  });

  it("returns the existing user for a repeat Google login", async () => {
    findOneMock.mockResolvedValueOnce(existingGoogleUser);

    const result = await googleLoginUser({
      idToken: "valid-google-id-token",
    });

    expect(findOneMock).toHaveBeenCalledOnce();
    expect(createMock).not.toHaveBeenCalled();

    expect(result).toEqual({
      id: "google-user-123",
      username: "vishal1234",
      email: "vishal@example.com",
      createdAt: existingGoogleUser.createdAt,
    });
  });

  it("rejects linking an email already connected to another Google account", async () => {
    const conflictingUser = {
      ...existingGoogleUser,
      googleId: "different-google-user",
    };

    findOneMock
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(conflictingUser);

    await expect(
      googleLoginUser({ idToken: "valid-google-id-token" }),
    ).rejects.toMatchObject({
      statusCode: 409,
      code: "GOOGLE_ACCOUNT_CONFLICT",
    });

    expect(createMock).not.toHaveBeenCalled();
  });
});
