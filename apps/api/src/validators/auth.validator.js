
import { z } from "zod";

export const signupSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters.")
      .max(20, "Username must not exceed 20 characters.")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can contain only letters, numbers, and underscores.",
      ),

    email: z
      .string()
      .trim()
      .email("Please provide a valid email address.")
      .max(254, "Email must not exceed 254 characters.")
      .transform((value) => value.toLowerCase()),

    password: z
      .string()
      .min(12, "Password must be at least 12 characters.")
      .max(128, "Password must not exceed 128 characters."),
  })
  .strict();

  
export const loginSchema = z
  .object({
    email: z
      .string()
      .trim()
      .email("Please provide a valid email address.")
      .max(254, "Email must not exceed 254 characters.")
      .transform((value) => value.toLowerCase()),

    password: z
      .string()
      .min(1, "Password is required.")
      .max(128, "Password must not exceed 128 characters."),
  })
  .strict();

  export const googleLoginSchema = z
  .object({
    idToken: z
      .string()
      .min(1, "Google ID token is required.")
      .max(10_000, "Google ID token is too long."),
  })
  .strict();