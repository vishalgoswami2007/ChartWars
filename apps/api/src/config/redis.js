import Redis from "ioredis";

let client; // undefined = abhi bana nahi, null = REDIS_URL set nahi

/**
 * Pehli baar bulane par client banta hai (taaki .env pehle load ho chuka ho).
 * REDIS_URL na ho to null deta hai: app bina Redis ke chalti rahe.
 */
export function getRedis() {
  if (client !== undefined) return client;

  const url = process.env.REDIS_URL;
  if (!url) {
    client = null;
    return client;
  }

  client = new Redis(url, {
    maxRetriesPerRequest: 2, // Redis band ho to command jaldi fail ho, request latak na jaye
    retryStrategy: (times) => Math.min(times * 500, 5000),
  });
  client.on("ready", () => console.log("Redis connected"));
  client.on("error", (err) => console.error("[redis]", err.message));
  return client;
}

export const redisEnabled = () => getRedis() !== null;

// Saare keys ek pattern me: cw:<domain>:<id>
export const key = (...parts) => ["cw", ...parts].join(":");

export async function redisHealth() {
  const redis = getRedis();
  if (!redis) return "disabled";
  try {
    return (await redis.ping()) === "PONG" ? "ok" : "down";
  } catch {
    return "down";
  }
}