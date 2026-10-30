import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";

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
  await user.save();
  return user;
}

// public profile: email aur private cheezein nahi dikhani
export async function getPublicProfile(userCode) {
  const user = await User.findOne({ userCode: userCode.toUpperCase() }).select(
    "name avatar bio userCode elo stats createdAt"
  );
  if (!user) throw ApiError.notFound("User not found");
  return user;
}