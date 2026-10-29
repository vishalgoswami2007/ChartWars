import crypto from "node:crypto";
import { Otp } from "../models/Otp.js";
import { env } from "../config/env.js";
import { OTP_TTL_MS, OTP_MAX_ATTEMPTS, OTP_RESEND_COOLDOWN_MS } from "../constants/auth.js";
import { ApiError } from "../utils/ApiError.js";

const hashCode = (email, purpose, code) =>
  crypto.createHmac("sha256", env.OTP_SECRET).update(`${email}:${purpose}:${code}`).digest("hex");

export async function issueOtp(email, purpose) {
  const existing = await Otp.findOne({ email, purpose });
  if (existing) {
    const wait = OTP_RESEND_COOLDOWN_MS - (Date.now() - existing.lastSentAt.getTime());
    if (wait > 0) throw ApiError.tooMany(`Please wait ${Math.ceil(wait / 1000)}s before requesting another OTP`);
  }

  const code = String(crypto.randomInt(0, 1_000_000)).padStart(6, "0");
  await Otp.findOneAndUpdate(
    { email, purpose },
    {
      codeHash: hashCode(email, purpose, code),
      attempts: 0,
      lastSentAt: new Date(),
      expiresAt: new Date(Date.now() + OTP_TTL_MS),
    },
    { upsert: true }
  );
  return code;
}

export async function verifyOtp(email, purpose, code) {
  const otp = await Otp.findOne({ email, purpose });
  if (!otp || otp.expiresAt < new Date()) throw ApiError.badRequest("OTP expired or invalid", "OTP_INVALID");

  if (otp.attempts >= OTP_MAX_ATTEMPTS) {
    await otp.deleteOne();
    throw ApiError.tooMany("Too many wrong attempts. Request a new OTP.", "OTP_LOCKED");
  }

  const expected = Buffer.from(otp.codeHash);
  const actual = Buffer.from(hashCode(email, purpose, code));
  if (!crypto.timingSafeEqual(expected, actual)) {
    otp.attempts += 1;
    await otp.save();
    throw ApiError.badRequest("Incorrect OTP", "OTP_INVALID");
  }

  await otp.deleteOne(); // single use
}