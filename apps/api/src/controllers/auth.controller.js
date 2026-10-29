import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { REFRESH_COOKIE } from "../constants/auth.js";
import { setAuthCookies, clearAuthCookies } from "../config/cookies.js";
import * as auth from "../services/auth.service.js";
import { signAccessToken } from "../services/token.service.js";
import { rotateSession, revokeSession, revokeAllForUser } from "../services/refresh-session.service.js";

const meta = (req) => ({ ip: req.ip, userAgent: req.get("user-agent")?.slice(0, 200) });

async function loginResponse(req, res, user) {
  setAuthCookies(res, await auth.startSession(user, meta(req)));
  res.json({ user });
}

export const signup = asyncHandler(async (req, res) => {
  const { email } = await auth.signup(req.body);
  res.status(201).json({ message: "OTP sent to your email", email });
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const user = await auth.verifyEmail(req.body);
  await loginResponse(req, res, user);
});

export const resendOtp = asyncHandler(async (req, res) => {
  await auth.resendVerification(req.body);
  res.json({ message: "If the account exists, a new OTP has been sent" });
});

export const login = asyncHandler(async (req, res) => {
  const user = await auth.login(req.body);
  await loginResponse(req, res, user);
});

export const googleLogin = asyncHandler(async (req, res) => {
  const user = await auth.googleLogin(req.body);
  await loginResponse(req, res, user);
});

export const verifyResetOtp = asyncHandler(async (req, res) => {
  const resetToken = await auth.verifyResetOtp(req.body);
  res.json({ resetToken });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  await auth.forgotPassword(req.body);
  res.json({ message: "If the account exists, an OTP has been sent" });
});

export const resetPassword = asyncHandler(async (req, res) => {
  await auth.resetPassword(req.body);
  clearAuthCookies(res);
  res.json({ message: "Password updated. Please login." });
});

export const refresh = asyncHandler(async (req, res) => {
  const raw = req.cookies?.[REFRESH_COOKIE];
  if (!raw) throw ApiError.unauthorized();
  try {
    const { user, refreshToken } = await rotateSession(raw, meta(req));
    setAuthCookies(res, { accessToken: signAccessToken(user), refreshToken });
    res.json({ user });
  } catch (err) {
    clearAuthCookies(res);
    throw err;
  }
});

export const logout = asyncHandler(async (req, res) => {
  const raw = req.cookies?.[REFRESH_COOKIE];
  if (raw) await revokeSession(raw);
  clearAuthCookies(res);
  res.json({ message: "Logged out" });
});

export const logoutAll = asyncHandler(async (req, res) => {
  await revokeAllForUser(req.user.id);
  clearAuthCookies(res);
  res.json({ message: "Logged out from all devices" });
});

export const me = (req, res) => res.json({ user: req.user });