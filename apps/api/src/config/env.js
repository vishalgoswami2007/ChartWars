import { z } from "zod";


const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  HOST: z.string().min(1).default("127.0.0.1"),
  MONGODB_URI: z.string().optional(),
  PORT: z.coerce
    .number()
    .int()
    .min(1)
    .max(65535)
    .default(4000),

  WEB_ORIGIN: z.url().default("http://localhost:5173"),

  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
    .default("info"),

    
        ACCESS_TOKEN_SECRET: z.string().min(64).optional(),
        ACCESS_TOKEN_TTL: z.string().default("15m"),
        REFRESH_TOKEN_TTL_DAYS: z.coerce.number().int().min(1).max(30).default(7),

});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error("Invalid environment configuration:");

  for (const issue of result.error.issues) {
    console.error(`- ${issue.path.join(".")}: ${issue.message}`);
  }

  process.exit(1);
}

export const env = Object.freeze(result.data);