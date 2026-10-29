export const ACCESS_COOKIE = "cw_access";
export const REFRESH_COOKIE = "cw_refresh";

export const ACCESS_TOKEN_TTL = "15m";
export const ACCESS_COOKIE_MAX_AGE = 15 * 60 * 1000;
export const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export const OTP_TTL_MS = 10 * 60 * 1000;
export const OTP_MAX_ATTEMPTS = 5;
export const OTP_RESEND_COOLDOWN_MS = 60 * 1000;

export const BCRYPT_ROUNDS = 12;

export const OTP_PURPOSE = {
  VERIFY_EMAIL: "verify_email",
  RESET_PASSWORD: "reset_password",
};