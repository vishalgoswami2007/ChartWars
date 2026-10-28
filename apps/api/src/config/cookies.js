
import { env } from "./env.js";

const secure = env.NODE_ENV === "production";

export const accessCookieOptions = {
  httpOnly: true,
  secure,
  sameSite: "lax",
  path: "/",
  maxAge: 15 * 60 * 1000,
};

export const refreshCookieOptions = {
  httpOnly: true,
  secure,
  sameSite: "lax",
  path: "/api/v1/auth",
  maxAge: env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
};
