
import bcrypt from "bcrypt";
import User from "../models/User.js";

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
