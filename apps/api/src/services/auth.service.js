import bcrypt from "bcrypt";
import { User } from "../models/User.js";
import { BCRYPT_ROUNDS, OTP_PURPOSE } from "../constants/auth.js";
import { ApiError } from "../utils/ApiError.js";
import { issueOtp, verifyOtp } from "./otp.service.js";
import { sendOtpEmail } from "./email.service.js";
import { signAccessToken, signResetToken, verifyResetToken, fingerprint } from "./token.service.js";
import { createSession, revokeAllForUser } from "./refresh-session.service.js";
import { verifyGoogleCredential } from "./google-auth.service.js";

// compared against when the email doesn't exist, so response time doesn't reveal accounts
const DUMMY_HASH = bcrypt.hashSync("chartwars-dummy", BCRYPT_ROUNDS);

async function sendOtp(user, purpose) {
  const code = await issueOtp(user.email, purpose);
  await sendOtpEmail({ to: user.email, name: user.name, code, purpose });
}

// forgot/resend answer identically whether or not the account exists
async function quietly(fn) {
  try {
    await fn();
  } catch (err) {
    if (!(err instanceof ApiError && err.status === 429)) throw err;
  }
}

export async function startSession(user, meta) {
  return {
    accessToken: signAccessToken(user),
    refreshToken: await createSession(user, meta),
  };
}

export async function signup({ name, email, password }) {
  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  let user = await User.findOne({ email });

  if (user?.isEmailVerified) throw ApiError.conflict("An account with this email already exists", "EMAIL_TAKEN");

  if (user) {
    user.name = name;
    user.passwordHash = passwordHash;
    await user.save();
  } else {
    user = await User.create({ name, email, passwordHash });
  }

  await sendOtp(user, OTP_PURPOSE.VERIFY_EMAIL);
  return { email: user.email };
}

export async function verifyEmail({ email, otp }) {
  await verifyOtp(email, OTP_PURPOSE.VERIFY_EMAIL, otp);
  const user = await User.findOne({ email });
  if (!user) throw ApiError.badRequest("OTP expired or invalid", "OTP_INVALID");
  user.isEmailVerified = true;
  user.lastLoginAt = new Date();
  await user.save();
  return user;
}

export async function resendVerification({ email }) {
  await quietly(async () => {
    const user = await User.findOne({ email });
    if (user && !user.isEmailVerified) await sendOtp(user, OTP_PURPOSE.VERIFY_EMAIL);
  });
}

export async function login({ email, password }) {
  const user = await User.findOne({ email }).select("+passwordHash");
  const ok = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);
  if (!user || !user.passwordHash || !ok) throw ApiError.unauthorized("Invalid email or password", "INVALID_CREDENTIALS");
  if (!user.isEmailVerified) throw ApiError.forbidden("Please verify your email first", "EMAIL_NOT_VERIFIED");

  user.lastLoginAt = new Date();
  await user.save();
  return user;
}

export async function forgotPassword({ email }) {
  await quietly(async () => {
    const user = await User.findOne({ email });
    if (user) await sendOtp(user, OTP_PURPOSE.RESET_PASSWORD);
  });
}

export async function verifyResetOtp({ email, otp }) {
  await verifyOtp(email, OTP_PURPOSE.RESET_PASSWORD, otp);
  const user = await User.findOne({ email }).select("+passwordHash");
  if (!user) throw ApiError.badRequest("OTP expired or invalid", "OTP_INVALID");
  return signResetToken(user);
}

export async function resetPassword({ resetToken, newPassword }) {
  const expired = () => ApiError.badRequest("Reset session expired. Please request a new code.", "RESET_EXPIRED");

  let payload;
  try {
    payload = verifyResetToken(resetToken);
  } catch {
    throw expired();
  }

  const user = await User.findById(payload.sub).select("+passwordHash");
  // token dies automatically once the password changes (single use)
  if (!user || fingerprint(user.passwordHash) !== payload.ph) throw expired();

  user.passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
  user.isEmailVerified = true;
  await user.save();
  await revokeAllForUser(user.id);
}


export async function googleLogin({ credential }) {
  const profile = await verifyGoogleCredential(credential);
  const find = () =>
    User.findOne({ $or: [{ googleId: profile.googleId }, { email: profile.email }] });

  let user = await find();

  if (!user) {
    try {
      user = await User.create({
        ...profile,
        isEmailVerified: true,
        lastLoginAt: new Date(),
      });
      return user;
    } catch (err) {
      if (err?.code !== 11000) throw err;
      console.error("Google create duplicate:", err.keyPattern, err.keyValue);
      user = await find(); // dusri request ne bana diya, ab wahi utha lo
      if (!user) throw err;
    }
  }

  if (!user.googleId) {
    // Anti pre-hijack: unverified password signup wipe
    if (!user.isEmailVerified) user.passwordHash = undefined;
    user.googleId = profile.googleId;
  }
  user.isEmailVerified = true;
  user.avatar = user.avatar || profile.avatar;
  user.lastLoginAt = new Date();
  await user.save();
  return user;
}