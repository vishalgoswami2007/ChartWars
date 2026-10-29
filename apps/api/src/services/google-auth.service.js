import { OAuth2Client } from "google-auth-library";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";

const client = new OAuth2Client(env.GOOGLE_CLIENT_ID);

export async function verifyGoogleCredential(idToken) {
  let payload;
  try {
    const ticket = await client.verifyIdToken({ idToken, audience: env.GOOGLE_CLIENT_ID });
    payload = ticket.getPayload();
  } catch {
    throw ApiError.unauthorized("Invalid Google credential");
  }
  if (!payload?.email || !payload.email_verified) {
    throw ApiError.unauthorized("Google email is not verified");
  }
  return {
    googleId: payload.sub,
    email: payload.email.toLowerCase(),
    name: payload.name || payload.email.split("@")[0],
    avatar: payload.picture,
  };
}