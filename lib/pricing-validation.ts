import { z } from "zod";

const pricingRatesSchema = z.object({
  minuteRate: z.number().min(0).max(10),
  developmentHourlyRate: z.number().min(0).max(500),
  concurrency: z.number().min(0).max(1000),
  intelligentTool: z.number().min(0).max(500),
  platform: z.number().min(0).max(10000),
  whatsappMarketing: z.number().min(0).max(10),
  whatsappUtility: z.number().min(0).max(10),
  whatsappTemplate: z.number().min(0).max(500),
  geolocation: z.number().min(0).max(10),
});

export const pricingConfigSchema = z.object({
  client: pricingRatesSchema,
  reseller: pricingRatesSchema,
});

export function validatePricingConfig(data: unknown) {
  return pricingConfigSchema.safeParse(data);
}
