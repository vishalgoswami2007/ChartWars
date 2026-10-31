import { isProd } from "./env.js";
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  ACCESS_COOKIE_MAX_AGE,
  REFRESH_TTL_MS,
} from "../constants/auth.js";

const base = { httpOnly: true, secure: isProd, sameSite: isProd ? "none" : "lax" };
const ACCESS_PATH = "/";
const REFRESH_PATH = "/api/v1/auth"; // refresh cookie only travels to auth routes

export function setAuthCookies(res, { accessToken, refreshToken }) {
  res.cookie(ACCESS_COOKIE, accessToken, { ...base, path: ACCESS_PATH, maxAge: ACCESS_COOKIE_MAX_AGE });
  res.cookie(REFRESH_COOKIE, refreshToken, { ...base, path: REFRESH_PATH, maxAge: REFRESH_TTL_MS });
}

export function clearAuthCookies(res) {
  res.clearCookie(ACCESS_COOKIE, { ...base, path: ACCESS_PATH });
  res.clearCookie(REFRESH_COOKIE, { ...base, path: REFRESH_PATH });
}