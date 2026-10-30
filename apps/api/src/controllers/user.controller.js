import { asyncHandler } from "../utils/asyncHandler.js";
import { updateProfileSchema } from "../validators/user.validation.js";
import * as users from "../services/user.service.js";

export const getMe = asyncHandler(async (req, res) => {
  res.json({ user: await users.getMe(req.user.id) });
});

export const updateMe = asyncHandler(async (req, res) => {
  const data = updateProfileSchema.parse(req.body);
  res.json({ user: await users.updateMe(req.user.id, data) });
});

export const getPublicProfile = asyncHandler(async (req, res) => {
  res.json({ user: await users.getPublicProfile(req.params.userCode) });
});