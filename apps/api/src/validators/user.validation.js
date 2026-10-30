import { z } from "zod";

const username = z
  .string().trim().toLowerCase()
  .regex(/^[a-z0-9_]{3,20}$/, "Username: 3-20 characters, only a-z, 0-9 and _");

const strongPassword = z
  .string()
  .min(8, "At least 8 characters")
  .regex(/[a-z]/, "Add a lowercase letter")
  .regex(/[A-Z]/, "Add an uppercase letter")
  .regex(/[0-9]/, "Add a number")
  .regex(/[^a-zA-Z0-9]/, "Add a symbol");

export const updateProfileSchema = z
  .object({
    name: z.string().trim().min(2).max(60).optional(),
    bio: z.string().trim().max(160).optional(),
    avatar: z.union([z.literal(""), z.string().url().max(500).startsWith("https://")]).optional(),
    username: username.optional(),
    preferences: z
      .object({ sound: z.boolean().optional(), emailNotifications: z.boolean().optional() })
      .strict()
      .optional(),
  })
  .strict(); // elo, balance, stats, email: kuch bhi extra aaya to reject

export const usernameCheckSchema = z.object({ u: username });

export const changePasswordSchema = z
  .object({ currentPassword: z.string().min(1), newPassword: strongPassword })
  .strict();

export const deleteAccountSchema = z
  .object({ confirm: z.literal("DELETE"), password: z.string().optional() })
  .strict();