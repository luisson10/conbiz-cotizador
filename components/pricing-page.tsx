"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowDownRight, CheckCircle2, FileText, Settings2, Waypoints } from "lucide-react";

import { BusinessModelExplainer } from "@/components/business-model-explainer";
import { FaqSection } from "@/components/faq-section";
import { PricingConfigModal } from "@/components/pricing-config-modal";
import { PricingModeToggle } from "@/components/pricing-mode-toggle";
import { PrintableQuoteView } from "@/components/printable-quote-view";
import { QuoteCalculatorForm } from "@/components/quote-calculator-form";
import { QuoteSummaryCard } from "@/components/quote-summary-card";
import { TermsSection } from "@/components/terms-section";
import { PdfExportCta } from "@/components/whatsapp-cta";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  calculateQuote,
  createAgent,
  DEFAULT_GLOBAL_INPUTS,
  PRICING,
  type PricingMode,
  type AgentQuoteInputs,
  type GlobalQuoteInputs,
  type PricingConfig,
} from "@/lib/pricing";
import { formatCurrency, type CurrencyCode } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "#modelo", label: "Modelo" },
  { href: "#cotizador", label: "Cotizador" },
  { href: "#terminos", label: "Términos" },
  { href: "#faq", label: "FAQ" },
];

export function PricingPage() {
  const [mode, setMode] = useState<PricingMode>("client");
  const [globalInputs, setGlobalInputs] = useState<GlobalQuoteInputs>(DEFAULT_GLOBAL_INPUTS);
  const [agents, setAgents] = useState<AgentQuoteInputs[]>([createAgent(0)]);
  const [pricingConfig, setPricingConfig] = useState<PricingConfig>(PRICING);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [exchangeRateDate, setExchangeRateDate] = useState<string | null>(null);
  const [exchangeRateSource, setExchangeRateSource] = useState<string | null>(null);

  const breakdown = useMemo(
    () => calculateQuote(mode, globalInputs, agents, pricingConfig),
    [mode, globalInputs, agents, pricingConfig],
  );

  useEffect(() => {
    const raw = window.localStorage.getItem("conbiz-pricing-config");
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as PricingConfig;
      setPricingConfig(parsed);
    } catch {
      window.localStorage.removeItem("conbiz-pricing-config");
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("conbiz-pricing-config", JSON.stringify(pricingConfig));
  }, [pricingConfig]);

  useEffect(() => {
    let ignore = false;

    async function loadExchangeRate() {
      try {
        const response = await fetch("/api/exchange-rate", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Exchange rate unavailable");
        }

        const data = (await response.json()) as {
          rate: number | null;
          date: string | null;
          source: string | null;
        };

        if (!ignore) {
          setExchangeRate(data.rate);
          setExchangeRateDate(data.date);
          setExchangeRateSource(data.source);
        }
      } catch {
        if (!ignore) {
          setExchangeRate(null);
          setExchangeRateDate(null);
          setExchangeRateSource(null);
        }
      }
    }

    void loadExchangeRate();

    return () => {
      ignore = true;
    };
  }, []);

  const agentSummary = breakdown.agents.map((agent) => ({
    id: agent.id,
    name: agent.name,
    setupSubtotal: agent.setupSubtotal,
    monthlySubtotal: agent.monthlySubtotal,
    monthlyDetails: (() => {
      const source = agents.find((item) => item.id === agent.id);
      if (!source) return [];

      const parts: Array<{ label: string; value: string }> = [
        {
          label: `${source.concurrency} concurrencias x ${formatCurrency(pricingConfig.concurrency)} c/u`,
          value: formatCurrency(source.concurrency * pricingConfig.concurrency),
        },
      ];

      if (source.useWhatsApp) {
        parts.push({
          label: `WhatsApp base: ${source.concurrency} x ${formatCurrency(pricingConfig.intelligentTool)}`,
          value: formatCurrency(source.concurrency * pricingConfig.intelligentTool),
        });
      }
      if (source.includeGeolocation) {
        parts.push({
          label: `Geolocalización base: ${source.concurrency} x ${formatCurrency(pricingConfig.intelligentTool)}`,
          value: formatCurrency(source.concurrency * pricingConfig.intelligentTool),
        });
      }
      if (source.includeCustomTool) {
        parts.push({
          label: `Personalizada base: ${source.concurrency} x ${formatCurrency(pricingConfig.intelligentTool)}`,
          value: formatCurrency(source.concurrency * pricingConfig.intelligentTool),
        });
      }
      if (source.useWhatsApp) {
        if (source.marketingMessages > 0) {
          parts.push({
            label: `${source.marketingMessages} mensajes marketing x ${formatCurrency(pricingConfig.whatsappMarketing)}`,
            value: formatCurrency(source.marketingMessages * pricingConfig.whatsappMarketing),
          });
        }
        if (source.utilityMessages > 0) {
          parts.push({
            label: `${source.utilityMessages} mensajes utilitarios x ${formatCurrency(pricingConfig.whatsappUtility)}`,
            value: formatCurrency(source.utilityMessages * pricingConfig.whatsappUtility),
          });
        }
        if (source.whatsappTemplates > 0) {
          parts.push({
            label: `${source.whatsappTemplates} plantillas x ${formatCurrency(pricingConfig.whatsappTemplate)}`,
            value: formatCurrency(source.whatsappTemplates * pricingConfig.whatsappTemplate),
          });
        }
      }
      if (source.includeGeolocation) {
        parts.push({
          label: `Geolocalización: ${source.geolocationQueries} consultas x ${formatCurrency(pricingConfig.geolocation)}`,
          value: formatCurrency(source.geolocationQueries * pricingConfig.geolocation),
        });
      }
      if (source.includeCustomTool && source.customToolMonthly > 0) {
        parts.push({
          label: source.customToolName,
          value: formatCurrency(source.customToolMonthly),
        });
      }

      return parts;
    })(),
  }));

  const updateGlobalInput = <K extends keyof GlobalQuoteInputs>(key: K, value: GlobalQuoteInputs[K]) => {
    setGlobalInputs((current) => ({ ...current, [key]: value }));
  };

  const updateAgentInput = <K extends keyof AgentQuoteInputs>(agentId: string, key: K, value: AgentQuoteInputs[K]) => {
    setAgents((current) => current.map((agent) => (agent.id === agentId ? { ...agent, [key]: value } : agent)));
  };

  const addAgent = () => {
    setAgents((current) => [...current, createAgent(current.length)]);
  };

  const removeAgent = (agentId: string) => {
    setAgents((current) => (current.length === 1 ? current : current.filter((agent) => agent.id !== agentId)));
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
                <Button type="button" variant="secondary" size="lg" onClick={() => setIsPricingModalOpen(true)}>
                  Variables de cálculo
                  <Settings2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <Card className="rounded-2xl p-5">
                  <p className="text-sm text-stone-500">Precio por minuto</p>
                  <p className="mt-2 text-2xl font-semibold text-stone-950">{formatCurrency(breakdown.minuteRate)}</p>
                </Card>
                <Card className="rounded-2xl p-5">
                  <p className="text-sm text-stone-500">Setup base por agente</p>
                  <p className="mt-2 text-2xl font-semibold text-stone-950">{formatCurrency(pricingConfig.developmentBasePrice)}</p>
                </Card>
                <Card className="rounded-2xl p-5">
                  <p className="text-sm text-stone-500">Plataforma global</p>
                  <p className="mt-2 text-2xl font-semibold text-stone-950">{formatCurrency(pricingConfig.platform)}</p>
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
                  "Modelo modular con costos globales y tarjetas por agente",
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
                Minutos y plataforma viven a nivel global. Cada agente define su propio setup, concurrencia y
                herramientas, y el resumen consolida todo en una sola cotización.
              </p>
            </div>

            <PricingModeToggle mode={mode} onChange={setMode} />

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]">
              <QuoteCalculatorForm
                globalInputs={globalInputs}
                agents={agents}
                onGlobalChange={updateGlobalInput}
                onAgentChange={updateAgentInput}
                onAddAgent={addAgent}
                onRemoveAgent={removeAgent}
              />
              <QuoteSummaryCard
                mode={mode}
                minuteRate={breakdown.minuteRate}
                minutes={globalInputs.minutes}
                setupSubtotal={breakdown.setupSubtotal}
                monthlySubtotal={breakdown.monthlySubtotal}
                guaranteeDeposit={breakdown.guaranteeDeposit}
                totalStartup={breakdown.totalStartup}
                globalMonthlySubtotal={breakdown.monthlyMinutes}
                platformMonthlySubtotal={breakdown.monthlyPlatform}
                agents={agentSummary}
                currency={currency}
                onCurrencyChange={setCurrency}
                exchangeRate={exchangeRate}
                exchangeRateDate={exchangeRateDate}
                exchangeRateSource={exchangeRateSource}
                onPrint={() => window.print()}
              />
            </div>
          </section>

          <TermsSection />
          <FaqSection />
          <PdfExportCta onPrint={() => window.print()} />
          <PricingConfigModal
            open={isPricingModalOpen}
            pricing={pricingConfig}
            onClose={() => setIsPricingModalOpen(false)}
            onChange={setPricingConfig}
            onReset={() => setPricingConfig(PRICING)}
          />
          <PrintableQuoteView
            mode={mode}
            minuteRate={breakdown.minuteRate}
            minutes={globalInputs.minutes}
            setupSubtotal={breakdown.setupSubtotal}
            monthlySubtotal={breakdown.monthlySubtotal}
            guaranteeDeposit={breakdown.guaranteeDeposit}
            totalStartup={breakdown.totalStartup}
            globalMonthlySubtotal={breakdown.monthlyMinutes}
            platformMonthlySubtotal={breakdown.monthlyPlatform}
            agents={agentSummary}
            currency={currency}
            exchangeRate={exchangeRate}
            exchangeRateDate={exchangeRateDate}
            exchangeRateSource={exchangeRateSource}
          />
        </main>
      </div>
    </div>
  );
}
