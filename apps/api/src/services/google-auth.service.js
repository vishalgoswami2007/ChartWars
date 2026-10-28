
import { OAuth2Client } from "google-auth-library";
import { env } from "../config/env.js";

const googleClient = new OAuth2Client();

export async function verifyGoogleIdToken(idToken) {
  if (typeof idToken !== "string" || !idToken.trim()) {
    const error = new Error("Google ID token is required.");
    error.statusCode = 400;
    error.code = "GOOGLE_ID_TOKEN_REQUIRED";
    throw error;
  }

  if (!env.GOOGLE_CLIENT_ID) {
    throw new Error("GOOGLE_CLIENT_ID is not configured.");
  }

  let ticket;

  try {
    ticket = await googleClient.verifyIdToken({
      idToken,
      audience: env.GOOGLE_CLIENT_ID,
    });
  } catch {
    const error = new Error("Google ID token is invalid or expired.");
    error.statusCode = 401;
    error.code = "INVALID_GOOGLE_TOKEN";
    throw error;
  }

  const payload = ticket.getPayload();

  if (
    !payload ||
    !payload.sub ||
    !payload.email ||
    payload.email_verified !== true
  ) {
    const error = new Error(
      "Google account must have a verified email address.",
    );
    error.statusCode = 401;
    error.code = "GOOGLE_EMAIL_NOT_VERIFIED";
    throw error;
  }

  return {
    googleId: payload.sub,
    email: payload.email.toLowerCase(),
    emailVerified: true,
    name: payload.name ?? "",
    picture: payload.picture ?? null,
  };
}
