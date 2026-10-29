import rateLimit from "express-rate-limit";

const make = (windowMs, limit, message) =>
  rateLimit({ windowMs, limit, standardHeaders: true, legacyHeaders: false, message: { message, code: "RATE_LIMITED" } });

export const authLimiter = make(15 * 60 * 1000, 30, "Too many attempts, try again later");
export const otpLimiter = make(10 * 60 * 1000, 10, "Too many OTP requests, try again later");