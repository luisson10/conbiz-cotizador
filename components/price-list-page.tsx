"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, LogOut, Settings2 } from "lucide-react";

import { useAuthContext } from "@/components/auth-provider";
import { PricingConfigModal } from "@/components/pricing-config-modal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { fetchPricingConfig, persistPricingConfig, subscribeToPricingConfigUpdates } from "@/lib/pricing-config-client";
import { PRICE_LIST_ITEMS, PRICING, type PricingConfig } from "@/lib/pricing";
import { formatCurrency } from "@/lib/utils";

export function PriceListPage() {
  const { role, logout } = useAuthContext();
  const [pricingConfig, setPricingConfig] = useState<PricingConfig>(PRICING);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadPricingConfig() {
      const config = await fetchPricingConfig();
      if (!ignore) {
        setPricingConfig(config);
      }
    }

    void loadPricingConfig();

    const unsubscribe = subscribeToPricingConfigUpdates(() => {
      void loadPricingConfig();
    });

    return () => {
      ignore = true;
      unsubscribe();
    };
  }, []);

  const handleSavePricingConfig = async (nextPricing: PricingConfig) => {
    const saved = await persistPricingConfig(nextPricing);
    setPricingConfig(saved);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(245,245,244,0.9),_rgba(255,255,255,1)_48%)] text-stone-950">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 pb-20 pt-6 sm:px-6 lg:px-8">
        <header className="rounded-full border border-stone-200/80 bg-white/85 px-4 py-3 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-stone-200 bg-white p-2">
                <Image src="/conbiz-logo-color.svg" alt="Conbiz" width={110} height={28} className="h-7 w-auto" priority />
              </div>
              <span className="hidden text-sm text-stone-500 sm:inline">Lista de precios Conbiz</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button asChild variant="outline">
                <Link href="/">
                  <ArrowLeft className="h-4 w-4" />
                  Volver al cotizador
                </Link>
              </Button>
              {role === "admin" && (
                <Button type="button" variant="secondary" onClick={() => setIsPricingModalOpen(true)}>
                  Variables de cálculo
                  <Settings2 className="h-4 w-4" />
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={logout} className="text-stone-500">
                <LogOut className="h-4 w-4" />
                Salir
              </Button>
            </div>
          </div>
        </header>

        <section className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">Lista de precios</p>
          <h1 className="text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
            Precio público y partner en una sola vista.
          </h1>
          <p className="max-w-3xl text-base leading-7 text-stone-600">
            Esta vista muestra todos los rubros que usa el cotizador: costos de setup, operación mensual y consumos.
            Los valores se alimentan del mismo modal de variables de cálculo.
          </p>
        </section>

        <Card className="overflow-hidden">
          <div className="grid gap-px bg-stone-200 md:grid-cols-[minmax(0,1.2fr)_minmax(180px,0.4fr)_minmax(180px,0.4fr)]">
            <div className="bg-stone-50 p-4 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Concepto</div>
            <div className="bg-stone-50 p-4 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Precio al público</div>
            <div className="bg-stone-50 p-4 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Precio partner</div>

            {PRICE_LIST_ITEMS.map((item) => (
              <div key={item.key} className="contents">
                <div className="bg-white p-4">
                  <p className="text-sm font-semibold text-stone-900">{item.label}</p>
                  <p className="mt-1 text-xs leading-relaxed text-stone-500">{item.description}</p>
                </div>
                <div className="bg-white p-4 text-sm font-medium text-stone-900">
                  {formatCurrency(pricingConfig.client[item.key])}
                </div>
                <div className="bg-white p-4 text-sm font-medium text-stone-900">
                  {formatCurrency(pricingConfig.reseller[item.key])}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <PricingConfigModal
          open={isPricingModalOpen}
          pricing={pricingConfig}
          onClose={() => setIsPricingModalOpen(false)}
          onSave={handleSavePricingConfig}
        />
      </div>
    </div>
  );
}
