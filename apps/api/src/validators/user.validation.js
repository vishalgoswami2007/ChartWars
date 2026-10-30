import { z } from "zod";

export const updateProfileSchema = z
  .object({
    name: z.string().trim().min(2).max(60).optional(),
    bio: z.string().trim().max(160).optional(),
    avatar: z.union([z.literal(""), z.string().url().max(500).startsWith("https://")]).optional(),
  })
  .strict(); // elo, stats, email jaisa koi extra field aaya to reject