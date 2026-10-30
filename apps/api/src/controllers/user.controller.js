import { asyncHandler } from "../utils/asyncHandler.js";
import { setAuthCookies, clearAuthCookies } from "../config/cookies.js";
import * as auth from "../services/auth.service.js";
import * as users from "../services/user.service.js";
import {
  updateProfileSchema, usernameCheckSchema, changePasswordSchema, deleteAccountSchema,
} from "../validators/user.validation.js";

const meta = (req) => ({ ip: req.ip, userAgent: req.get("user-agent")?.slice(0, 200) });

export const getMe = asyncHandler(async (req, res) => {
  res.json({ user: await users.getMe(req.user.id) });
});

export const updateMe = asyncHandler(async (req, res) => {
  const data = updateProfileSchema.parse(req.body);
  res.json({ user: await users.updateMe(req.user.id, data) });
});

export const usernameAvailable = asyncHandler(async (req, res) => {
  const { u } = usernameCheckSchema.parse(req.query);
  res.json({ available: await users.isUsernameAvailable(u, req.user.id) });
});

export const getPublicProfile = asyncHandler(async (req, res) => {
  res.json({ user: await users.getPublicProfile(req.params.key) });
});

export const changePassword = asyncHandler(async (req, res) => {
  const user = await users.changePassword(req.user.id, changePasswordSchema.parse(req.body));
  // baaki devices logout ho gaye, is device ko naya session do
  setAuthCookies(res, await auth.startSession(user, meta(req)));
  res.json({ message: "Password updated" });
});

export const deleteAccount = asyncHandler(async (req, res) => {
  await users.deleteAccount(req.user.id, deleteAccountSchema.parse(req.body));
  clearAuthCookies(res);
  res.json({ message: "Account deleted" });
});