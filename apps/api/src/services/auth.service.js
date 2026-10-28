
import bcrypt from "bcrypt";
import User from "../models/User.js";
import { verifyGoogleIdToken } from "./google-auth.service.js";
const SALT_ROUNDS = 12;

export async function signupUser({ username, email, password }) {
  const normalizedUsername = username.trim();
  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await User.findOne({
    $or: [
      { username: normalizedUsername },
      { email: normalizedEmail },
    ],
  });

  if (existingUser) {
    const duplicateField =
      existingUser.email === normalizedEmail ? "email" : "username";

    const error = new Error(
      duplicateField === "email"
        ? "An account with this email already exists."
        : "This username is already taken.",
    );

    error.statusCode = 409;
    error.code = "ACCOUNT_ALREADY_EXISTS";
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  try {
    const user = await User.create({
      username: normalizedUsername,
      email: normalizedEmail,
      passwordHash,
    });

    return {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
    };
  } catch (error) {
    // Handles simultaneous signup attempts that hit a unique index.
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern ?? {})[0];
      const field = duplicateField === "email" ? "email" : "username";

      const conflict = new Error(
        field === "email"
          ? "An account with this email already exists."
          : "This username is already taken.",
      );

      conflict.statusCode = 409;
      conflict.code = "ACCOUNT_ALREADY_EXISTS";
      throw conflict;
    }

    throw error;
  }
}


export async function loginUser({ email, password }) {
  const normalizedEmail = email.trim().toLowerCase();

  // passwordHash is excluded by default in the User model,
  // so explicitly select it for password verification.
  const user = await User.findOne({ email: normalizedEmail })
    .select("+passwordHash");

  // Use the same response for an unknown email and wrong password.
  if (!user) {
    const error = new Error("Invalid email or password.");
    error.statusCode = 401;
    error.code = "INVALID_CREDENTIALS";
    throw error;
  }

  const passwordMatches = await bcrypt.compare(
    password,
    user.passwordHash,
  );

  if (!passwordMatches) {
    const error = new Error("Invalid email or password.");
    error.statusCode = 401;
    error.code = "INVALID_CREDENTIALS";
    throw error;
  }

  return {
    id: user._id.toString(),
    username: user.username,
    email: user.email,
    createdAt: user.createdAt,
  };
}

function createUsernameBase(name, email) {
  const namePart = (name || email.split("@")[0])
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "")
    .slice(0, 15);

  return namePart.length >= 3 ? namePart : "player";
}

async function generateUniqueUsername(name, email) {
  const base = createUsernameBase(name, email);

  for (let attempt = 0; attempt < 10; attempt += 1) {
    const suffix = Math.floor(1000 + Math.random() * 9000);
    const username = `${base.slice(0, 15)}${suffix}`.slice(0, 20);

    const exists = await User.exists({ username });

    if (!exists) {
      return username;
    }
  }

  const error = new Error("Could not generate a unique username.");
  error.statusCode = 503;
  error.code = "USERNAME_GENERATION_FAILED";
  throw error;
}

export async function googleLoginUser({ idToken }) {
  const googleProfile = await verifyGoogleIdToken(idToken);

  let user = await User.findOne({ googleId: googleProfile.googleId });

  if (!user) {
    user = await User.findOne({ email: googleProfile.email });

    if (user) {
      // Google has verified this email. Link the account only if
      // it is not already linked to a different Google identity.
      if (
        user.googleId &&
        user.googleId !== googleProfile.googleId
      ) {
        const error = new Error(
          "This email is linked to another Google account.",
        );
        error.statusCode = 409;
        error.code = "GOOGLE_ACCOUNT_CONFLICT";
        throw error;
      }

      user.googleId = googleProfile.googleId;
      user.profilePicture = googleProfile.picture;
      await user.save();
    } else {
      const username = await generateUniqueUsername(
        googleProfile.name,
        googleProfile.email,
      );

      user = await User.create({
        username,
        email: googleProfile.email,
        googleId: googleProfile.googleId,
        profilePicture: googleProfile.picture,
      });
    }
  }

  return {
    id: user._id.toString(),
    username: user.username,
    email: user.email,
    createdAt: user.createdAt,
  };
}