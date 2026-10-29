import { ACCESS_COOKIE } from "../constants/auth.js";
import { User } from "../models/User.js";
import { verifyAccessToken } from "../services/token.service.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const requireAuth = asyncHandler(async (req, _res, next) => {
  const token = req.cookies?.[ACCESS_COOKIE];
  if (!token) throw ApiError.unauthorized();

  let payload;
  try {
    payload = verifyAccessToken(token);
  } catch {
    throw ApiError.unauthorized();
  }

  const user = await User.findById(payload.sub);
  if (!user) throw ApiError.unauthorized();

  req.user = user;
  next();
});