"use client";

import { Settings2, X } from "lucide-react";
import { useEffect, useState } from "react";

import { useExchangeRate } from "@/hooks/use-exchange-rate";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PRICE_LIST_ITEMS, normalizePricingConfig, PRICING, type PricingConfig } from "@/lib/pricing";
import { toDisplayValue, type CurrencyCode } from "@/lib/utils";

type PricingConfigModalProps = {
  open: boolean;
  pricing: PricingConfig;
  onClose: () => void;
  onSave: (pricing: PricingConfig) => Promise<void> | void;
};

type PricingFieldKey = keyof PricingConfig["client"];
type PricingFieldMode = "client" | "reseller";

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

export function PricingConfigModal({ open, pricing, onClose, onSave }: PricingConfigModalProps) {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const { exchangeRate } = useExchangeRate({ enabled: open });
  const [draftPricing, setDraftPricing] = useState<PricingConfig>(normalizePricingConfig(pricing));
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const safePricing = normalizePricingConfig(draftPricing);

  useEffect(() => {
    if (!open) return;
    setDraftPricing(normalizePricingConfig(pricing));
    setSaveError(null);
  }, [open, pricing]);

  useEffect(() => {
    if (!open) return;

    const nextFieldValues: Record<string, string> = {};

    for (const item of PRICE_LIST_ITEMS) {
      nextFieldValues[`client-${item.key}`] = toDisplayValue(safePricing.client[item.key], currency, exchangeRate);
      nextFieldValues[`reseller-${item.key}`] = toDisplayValue(safePricing.reseller[item.key], currency, exchangeRate);
    }

    setFieldValues(nextFieldValues);
  }, [open, currency, exchangeRate, pricing]);

  if (!open) return null;

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);

    try {
      await onSave(safePricing);
      onClose();
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "No se pudo guardar la configuración.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleFieldChange = (mode: PricingFieldMode, key: PricingFieldKey, rawValue: string) => {
    const normalizedRawValue = rawValue.replace(",", ".");
    const fieldId = `${mode}-${key}`;

    setFieldValues((current) => ({
      ...current,
      [fieldId]: normalizedRawValue,
    }));

    if (!/^\d*\.?\d*$/.test(normalizedRawValue) || normalizedRawValue === "" || normalizedRawValue === ".") {
      return;
    }

    const parsed = Number(normalizedRawValue);
    if (!Number.isFinite(parsed)) return;

    const nextValue =
      currency === "MXN" && exchangeRate ? Number((parsed / exchangeRate).toFixed(6)) : parsed;

    setDraftPricing((current) => updatePricingValue(current, mode, key, nextValue));
  };

  const handleFieldBlur = (mode: PricingFieldMode, key: PricingFieldKey) => {
    const fieldId = `${mode}-${key}`;
    const value = safePricing[mode][key];

    setFieldValues((current) => ({
      ...current,
      [fieldId]: toDisplayValue(value, currency, exchangeRate),
    }));
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
                      type="text"
                      inputMode="decimal"
                      value={fieldValues[`client-${item.key}`] ?? ""}
                      onChange={(event) => handleFieldChange("client", item.key, event.target.value)}
                      onBlur={() => handleFieldBlur("client", item.key)}
                    />
                  </div>
                  <div className="rounded-2xl border border-stone-200 bg-white p-4">
                    <Label htmlFor={`${item.key}-reseller`} className="sr-only">
                      {item.label} partner
                    </Label>
                    <Input
                      id={`${item.key}-reseller`}
                      type="text"
                      inputMode="decimal"
                      value={fieldValues[`reseller-${item.key}`] ?? ""}
                      onChange={(event) => handleFieldChange("reseller", item.key, event.target.value)}
                      onBlur={() => handleFieldBlur("reseller", item.key)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {saveError ? <div className="text-sm text-red-600">{saveError}</div> : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={() => setDraftPricing(PRICING)} disabled={isSaving}>
              Restablecer valores
            </Button>
            <Button type="button" variant="ghost" onClick={onClose} disabled={isSaving}>
              Cancelar
            </Button>
            <Button type="button" onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
