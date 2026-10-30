import bcrypt from "bcrypt";
import { User } from "../models/User.js";
import { Transaction } from "../models/Transaction.js";
import { ApiError } from "../utils/ApiError.js";
import { BCRYPT_ROUNDS } from "../constants/auth.js";
import { revokeAllForUser } from "./refresh-session.service.js";

export async function getMe(id) {
  const user = await User.findById(id);
  if (!user) throw ApiError.unauthorized();
  return user;
}

export async function updateMe(id, data) {
  const user = await getMe(id);
  if (data.name !== undefined) user.name = data.name;
  if (data.bio !== undefined) user.bio = data.bio;
  if (data.avatar !== undefined) user.avatar = data.avatar || undefined;
  if (data.username !== undefined) user.username = data.username;
  if (data.preferences) {
    for (const [k, v] of Object.entries(data.preferences)) user.set(`preferences.${k}`, v);
  }
  try {
    await user.save();
  } catch (err) {
    if (err?.code === 11000 && err.keyPattern?.username) {
      throw ApiError.conflict("This username is already taken", "USERNAME_TAKEN");
    }
    throw err;
  }
  return user;
}

export async function isUsernameAvailable(username, selfId) {
  const taken = await User.exists({ username, _id: { $ne: selfId } });
  return !taken;
}

// username ya userCode, dono se profile khul jaye
export async function getPublicProfile(key) {
  const user = await User.findOne({
    $or: [{ username: key.toLowerCase() }, { userCode: key.toUpperCase() }],
  }).select("name username avatar bio userCode elo stats createdAt");
  if (!user) throw ApiError.notFound("User not found");
  return user;
}

export async function changePassword(id, { currentPassword, newPassword }) {
  const user = await User.findById(id).select("+passwordHash");
  if (!user) throw ApiError.unauthorized();
  if (!user.passwordHash) {
    throw ApiError.badRequest(
      "This account uses Google login. Use 'Forgot password' to set a password.",
      "NO_PASSWORD"
    );
  }

  if (!(await bcrypt.compare(currentPassword, user.passwordHash))) {
    throw ApiError.badRequest("Current password is incorrect", "INVALID_CREDENTIALS");
  }
  user.passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
  await user.save();
  await revokeAllForUser(user.id); // baaki sab devices logout
  return user;
}

export async function deleteAccount(id, { password }) {
  const user = await User.findById(id).select("+passwordHash");
  if (!user) throw ApiError.unauthorized();
  if (user.passwordHash) {
    if (!password || !(await bcrypt.compare(password, user.passwordHash))) {
      throw ApiError.badRequest("Password is incorrect", "INVALID_CREDENTIALS");
    }
  }
  await revokeAllForUser(id);
  await Transaction.deleteMany({ user: id });
  await User.deleteOne({ _id: id });
  
}