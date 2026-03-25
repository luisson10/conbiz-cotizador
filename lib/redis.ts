import "server-only";

import Redis from "ioredis";

let client: Redis | null = null;

export function getRedisClient(): Redis | null {
  if (client) return client;

  const url = process.env.REDIS_URL;
  if (!url) return null;

  client = new Redis(url, { maxRetriesPerRequest: 3, lazyConnect: true });

  client.on("error", (err) => {
    console.error("[Redis]", err.message);
  });

  return client;
}
