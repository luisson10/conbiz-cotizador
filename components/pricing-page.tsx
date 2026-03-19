"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowDownRight, CheckCircle2, FileText, Waypoints } from "lucide-react";

import { BusinessModelExplainer } from "@/components/business-model-explainer";
import { FaqSection } from "@/components/faq-section";
import { PricingModeToggle } from "@/components/pricing-mode-toggle";
import { PrintableQuoteView } from "@/components/printable-quote-view";
import { QuoteCalculatorForm } from "@/components/quote-calculator-form";
import { QuoteSummaryCard } from "@/components/quote-summary-card";
import { TermsSection } from "@/components/terms-section";
import { WhatsAppCTA } from "@/components/whatsapp-cta";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  buildWhatsAppMessage,
  calculateQuote,
  DEFAULT_QUOTE_INPUTS,
  type PricingMode,
  type QuoteInputs,
} from "@/lib/pricing";
import { formatCurrency } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "#modelo", label: "Modelo" },
  { href: "#cotizador", label: "Cotizador" },
  { href: "#terminos", label: "Términos" },
  { href: "#faq", label: "FAQ" },
];

export function PricingPage() {
  const [mode, setMode] = useState<PricingMode>("client");
  const [inputs, setInputs] = useState<QuoteInputs>(DEFAULT_QUOTE_INPUTS);

  const breakdown = useMemo(() => calculateQuote(mode, inputs), [mode, inputs]);
  const whatsappHref = useMemo(() => {
    const message = buildWhatsAppMessage(mode, inputs, breakdown);
    return `https://wa.me/?text=${encodeURIComponent(message)}`;
  }, [mode, inputs, breakdown]);

  const updateInput = <K extends keyof QuoteInputs>(key: K, value: QuoteInputs[K]) => {
    setInputs((current) => ({ ...current, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(245,245,244,0.9),_rgba(255,255,255,1)_48%)] text-stone-950">
      <div className="absolute inset-x-0 top-0 -z-10 h-[32rem] bg-[linear-gradient(180deg,rgba(245,245,244,0.9),rgba(255,255,255,0))]" />
      <div className="mx-auto flex max-w-7xl flex-col gap-20 px-4 pb-20 pt-6 sm:px-6 lg:px-8">
        <header className="rounded-full border border-stone-200/80 bg-white/85 px-4 py-3 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-stone-200 bg-white p-2">
                <Image src="/conbiz-logo-color.svg" alt="Conbiz" width={110} height={28} className="h-7 w-auto" priority />
              </div>
              <span className="hidden text-sm text-stone-500 sm:inline">Cotizador de agentes de voz e IA conversacional</span>
            </div>
            <nav className="flex flex-wrap items-center gap-2 text-sm text-stone-600">
              {NAV_ITEMS.map((item) => (
                <Link key={item.href} href={item.href} className="rounded-full px-3 py-2 transition hover:bg-stone-100 hover:text-stone-950">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        <main className="screen-content space-y-20">
          <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div className="space-y-8">
              <div className="inline-flex items-center rounded-full border border-stone-200 bg-white px-4 py-2 text-sm text-stone-600 shadow-sm">
                Pricing para clientes finales y asociados con desglose comercial completo
              </div>

              <div className="space-y-5">
                <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-stone-950 sm:text-6xl">
                  Cotiza un agente Conbiz con la misma claridad con la que lo vas a vender.
                </h1>
                <p className="max-w-3xl text-lg leading-8 text-stone-600">
                  Esta página separa setup, renta mensual, depósito de garantía y cargos por uso para que el modelo sea
                  defendible ante operación, finanzas y clientes finales.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="#cotizador">
                    Ir al cotizador
                    <ArrowDownRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="#terminos">
                    Ver términos
                    <FileText className="h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <Card className="rounded-2xl p-5">
                  <p className="text-sm text-stone-500">Precio por minuto</p>
                  <p className="mt-2 text-2xl font-semibold text-stone-950">{formatCurrency(breakdown.minuteRate)}</p>
                </Card>
                <Card className="rounded-2xl p-5">
                  <p className="text-sm text-stone-500">Setup base</p>
                  <p className="mt-2 text-2xl font-semibold text-stone-950">{formatCurrency(2800)}</p>
                </Card>
                <Card className="rounded-2xl p-5">
                  <p className="text-sm text-stone-500">Plataforma mensual</p>
                  <p className="mt-2 text-2xl font-semibold text-stone-950">{formatCurrency(250)}</p>
                </Card>
              </div>
            </div>

            <Card className="overflow-hidden border-stone-900 bg-stone-950 p-8 text-stone-50">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-white/10 p-3">
                  <Waypoints className="h-5 w-5" />
                </div>
                <p className="text-sm uppercase tracking-[0.18em] text-stone-400">Lo que ya resuelve este cotizador</p>
              </div>
              <div className="mt-8 space-y-4">
                {[
                  "Comparación inmediata entre tarifa cliente final y reseller",
                  "Cálculo modular de minutos, concurrencia, setup y herramientas",
                  "Resumen listo para imprimir o exportar a PDF",
                  "Explicación operativa del depósito, prepago y reglas de servicio",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-stone-200" />
                    <p className="text-sm leading-relaxed text-stone-300">{item}</p>
                  </div>
                ))}
              </div>
            </Card>
          </section>

          <BusinessModelExplainer />

          <section id="cotizador" className="space-y-6">
            <div className="max-w-3xl space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">Cotizador dinámico</p>
              <h2 className="text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
                Ajusta el escenario y obtén un desglose comercial listo para presentar.
              </h2>
              <p className="text-base leading-7 text-stone-600">
                Cambia el tipo de cliente, volumen operativo y herramientas activas. El resumen considera setup,
                mensualidad, depósito de garantía y total de arranque.
              </p>
            </div>

            <PricingModeToggle mode={mode} onChange={setMode} />

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]">
              <QuoteCalculatorForm inputs={inputs} onChange={updateInput} />
              <QuoteSummaryCard
                mode={mode}
                inputs={inputs}
                breakdown={breakdown}
                onPrint={() => window.print()}
                whatsappHref={whatsappHref}
              />
            </div>
          </section>

          <TermsSection />
          <FaqSection />
          <WhatsAppCTA href={whatsappHref} />
          <PrintableQuoteView mode={mode} inputs={inputs} breakdown={breakdown} />
        </main>
      </div>
    </div>
  );
}
