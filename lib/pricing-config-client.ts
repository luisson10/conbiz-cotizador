import { normalizePricingConfig, PRICING, type PricingConfig } from "@/lib/pricing";

const PRICING_SYNC_EVENT = "conbiz-pricing-config-updated";

export async function fetchPricingConfig() {
  try {
    const response = await fetch("/api/pricing-config", { cache: "no-store" });
    if (!response.ok) throw new Error("Pricing config unavailable");

    const data = (await response.json()) as PricingConfig;
    return normalizePricingConfig(data);
  } catch {
    return PRICING;
  }
}

export async function persistPricingConfig(pricing: PricingConfig) {
  const response = await fetch("/api/pricing-config", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(normalizePricingConfig(pricing)),
  });

  if (!response.ok) {
    throw new Error("No se pudo guardar la configuración.");
  }

  const saved = normalizePricingConfig((await response.json()) as PricingConfig);

  if (typeof window !== "undefined") {
    window.localStorage.setItem(PRICING_SYNC_EVENT, String(Date.now()));
    window.dispatchEvent(new CustomEvent(PRICING_SYNC_EVENT));
  }

  return saved;
}

export function subscribeToPricingConfigUpdates(onUpdate: () => void) {
  if (typeof window === "undefined") return () => undefined;

  const handleStorage = (event: StorageEvent) => {
    if (event.key === PRICING_SYNC_EVENT) {
      onUpdate();
    }
  };

  const handleCustomEvent = () => {
    onUpdate();
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(PRICING_SYNC_EVENT, handleCustomEvent);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(PRICING_SYNC_EVENT, handleCustomEvent);
  };
}

