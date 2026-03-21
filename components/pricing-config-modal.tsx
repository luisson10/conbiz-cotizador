"use client";

import { Settings2, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PRICE_LIST_ITEMS, normalizePricingConfig, type PricingConfig } from "@/lib/pricing";
import type { CurrencyCode } from "@/lib/utils";

type PricingConfigModalProps = {
  open: boolean;
  pricing: PricingConfig;
  onClose: () => void;
  onChange: (pricing: PricingConfig) => void;
  onReset: () => void;
};

function updatePricingValue(
  pricing: PricingConfig,
  mode: "client" | "reseller",
  key: keyof PricingConfig["client"],
  value: number,
) {
  return {
    ...pricing,
    [mode]: {
      ...pricing[mode],
      [key]: value,
    },
  };
}

export function PricingConfigModal({ open, pricing, onClose, onChange, onReset }: PricingConfigModalProps) {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const safePricing = normalizePricingConfig(pricing);

  useEffect(() => {
    if (!open) return;

    let ignore = false;

    async function loadExchangeRate() {
      try {
        const response = await fetch("/api/exchange-rate", { cache: "no-store" });
        const data = (await response.json()) as { rate: number | null };

        if (!ignore) {
          setExchangeRate(data.rate);
        }
      } catch {
        if (!ignore) {
          setExchangeRate(null);
        }
      }
    }

    void loadExchangeRate();

    return () => {
      ignore = true;
    };
  }, [open]);

  if (!open) return null;

  const toDisplay = (value: number) => {
    if (!Number.isFinite(value)) return "";
    if (currency === "MXN" && exchangeRate) return (value * exchangeRate).toFixed(4);
    return value.toString();
  };

  const fromDisplay = (rawValue: string, fallback: number) => {
    if (rawValue.trim() === "") return fallback;

    const parsed = Number(rawValue);
    if (!Number.isFinite(parsed)) return fallback;

    if (currency === "MXN" && exchangeRate) return Number((parsed / exchangeRate).toFixed(6));
    return parsed;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/35 p-4 backdrop-blur-sm">
      <Card className="max-h-[88vh] w-full max-w-5xl overflow-hidden">
        <CardHeader className="border-b border-stone-200 bg-stone-50">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="rounded-2xl border border-stone-200 bg-white p-2">
                  <Settings2 className="h-4 w-4 text-stone-700" />
                </div>
                <CardTitle>Variables de cálculo</CardTitle>
              </div>
              <CardDescription>
                Edita en granularidad total los precios de lista y partner. Los cambios impactan cotizador y lista de
                precios.
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="inline-flex rounded-full border border-stone-200 bg-white p-1">
                <button
                  type="button"
                  className={`min-w-16 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    currency === "USD" ? "bg-stone-950 text-white shadow-sm" : "text-stone-600"
                  }`}
                  onClick={() => setCurrency("USD")}
                >
                  USD
                </button>
                <button
                  type="button"
                  className={`min-w-16 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    currency === "MXN" ? "bg-stone-950 text-white shadow-sm" : "text-stone-600"
                  }`}
                  onClick={() => setCurrency("MXN")}
                >
                  MXN
                </button>
              </div>
              <Button type="button" variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="max-h-[calc(88vh-96px)] space-y-8 overflow-y-auto p-6">
          <div className="rounded-3xl border border-stone-200 bg-stone-50 p-5">
            <div className="mb-4 text-xs text-stone-500">
              Los valores se guardan internamente en USD. Si editas en MXN, el sistema convierte automáticamente con
              el FIX disponible de Banxico.
            </div>
            <div className="grid gap-4 md:grid-cols-[minmax(0,1.2fr)_minmax(180px,0.4fr)_minmax(180px,0.4fr)]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Concepto</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Precio al público</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Precio partner</p>
              </div>

              {PRICE_LIST_ITEMS.map((item) => (
                <div key={item.key} className="contents">
                  <div className="rounded-2xl border border-stone-200 bg-white p-4">
                    <p className="text-sm font-semibold text-stone-900">{item.label}</p>
                    <p className="mt-1 text-xs leading-relaxed text-stone-500">{item.description}</p>
                  </div>
                  <div className="rounded-2xl border border-stone-200 bg-white p-4">
                    <Label htmlFor={`${item.key}-client`} className="sr-only">
                      {item.label} público
                    </Label>
                    <Input
                      id={`${item.key}-client`}
                      type="number"
                      step={0.01}
                      value={toDisplay(safePricing.client[item.key])}
                      onChange={(event) =>
                        onChange(
                          updatePricingValue(
                            safePricing,
                            "client",
                            item.key,
                            fromDisplay(event.target.value, safePricing.client[item.key]),
                          ),
                        )
                      }
                    />
                  </div>
                  <div className="rounded-2xl border border-stone-200 bg-white p-4">
                    <Label htmlFor={`${item.key}-reseller`} className="sr-only">
                      {item.label} partner
                    </Label>
                    <Input
                      id={`${item.key}-reseller`}
                      type="number"
                      step={0.01}
                      value={toDisplay(safePricing.reseller[item.key])}
                      onChange={(event) =>
                        onChange(
                          updatePricingValue(
                            safePricing,
                            "reseller",
                            item.key,
                            fromDisplay(event.target.value, safePricing.reseller[item.key]),
                          ),
                        )
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={onReset}>
              Restablecer valores
            </Button>
            <Button type="button" onClick={onClose}>
              Cerrar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
