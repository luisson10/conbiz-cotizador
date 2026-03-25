import "server-only";

import { normalizePricingConfig, PRICING, type PricingConfig } from "@/lib/pricing";
import { getRedisClient } from "@/lib/redis";

const REDIS_KEY = "pricing-config";

export async function readPricingConfig() {
  const redis = getRedisClient();
  if (!redis) return PRICING;

  try {
    const raw = await redis.get(REDIS_KEY);
    if (!raw) return PRICING;
    return normalizePricingConfig(JSON.parse(raw));
  } catch {
    return PRICING;
  }
}

export async function writePricingConfig(config: PricingConfig) {
  const normalized = normalizePricingConfig(config);
  const redis = getRedisClient();

  if (!redis) {
    console.warn("[pricing-config] REDIS_URL not set — config not persisted");
    return normalized;
  }

  await redis.set(REDIS_KEY, JSON.stringify(normalized));
  return normalized;
}
