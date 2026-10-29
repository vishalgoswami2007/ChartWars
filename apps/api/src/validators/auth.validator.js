import { z } from "zod";

const email = z.string().trim().toLowerCase().email("Enter a valid email");
const password = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password is too long")
  .regex(/[a-z]/, "Password needs a lowercase letter")
  .regex(/[A-Z]/, "Password needs an uppercase letter")
  .regex(/\d/, "Password needs a number")
  .regex(/[^A-Za-z0-9]/, "Password needs a symbol");
const otp = z.string().regex(/^\d{6}$/, "OTP must be 6 digits");

export const signupSchema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(60),
  email,
  password,
});
export const verifyEmailSchema = z.object({ email, otp });
export const resendSchema = z.object({ email });
export const loginSchema = z.object({ email, password: z.string().min(1, "Password is required") });
export const forgotSchema = z.object({ email });
export const verifyResetSchema = z.object({ email, otp });
export const resetSchema = z.object({ resetToken: z.string().min(10), newPassword: password });
export const googleSchema = z.object({ credential: z.string().min(10) });