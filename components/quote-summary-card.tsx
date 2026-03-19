import { ArrowUpRight, Calculator, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { PricingMode, QuoteBreakdown, QuoteInputs } from "@/lib/pricing";
import { PRICING } from "@/lib/pricing";
import { formatCurrency, formatNumber } from "@/lib/utils";

type QuoteSummaryCardProps = {
  mode: PricingMode;
  inputs: QuoteInputs;
  breakdown: QuoteBreakdown;
  onPrint: () => void;
  whatsappHref: string;
};

function SummaryRow({ label, value, emphasized = false }: { label: string; value: string; emphasized?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2 text-sm">
      <span className={emphasized ? "font-medium text-stone-900" : "text-stone-600"}>{label}</span>
      <span className={emphasized ? "font-semibold text-stone-950" : "font-medium text-stone-900"}>{value}</span>
    </div>
  );
}

export function QuoteSummaryCard({ mode, inputs, breakdown, onPrint, whatsappHref }: QuoteSummaryCardProps) {
  const modeLabel = mode === "client" ? "Cliente final" : "Reseller";

  return (
    <Card className="sticky top-6 overflow-hidden">
      <CardHeader className="border-b border-stone-200 bg-stone-50">
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle>Resumen en vivo</CardTitle>
            <CardDescription>La cotización se actualiza al instante según el esquema elegido.</CardDescription>
          </div>
          <div className="rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-medium text-stone-700">
            {modeLabel}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-stone-500">Tarifa por minuto</p>
          <div className="mt-2 flex items-end justify-between gap-4">
            <p className="text-3xl font-semibold tracking-tight text-stone-950">{formatCurrency(breakdown.minuteRate)}</p>
            <p className="text-sm text-stone-500">{formatNumber(inputs.minutes)} min/mes</p>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-semibold text-stone-900">
            <Calculator className="h-4 w-4" />
            Desglose mensual
          </div>
          <SummaryRow label="Minutos" value={formatCurrency(breakdown.monthlyMinutes)} />
          <SummaryRow label={`Concurrencia (${inputs.concurrency} x ${formatCurrency(PRICING.concurrency)})`} value={formatCurrency(breakdown.monthlyConcurrency)} />
          <SummaryRow label="Herramientas inteligentes" value={formatCurrency(breakdown.monthlyToolsBase)} />
          <SummaryRow label="Plataforma Conbiz" value={formatCurrency(breakdown.monthlyPlatform)} />
          <SummaryRow label="WhatsApp marketing" value={formatCurrency(breakdown.monthlyWhatsAppMarketing)} />
          <SummaryRow label="WhatsApp utilidad" value={formatCurrency(breakdown.monthlyWhatsAppUtility)} />
          <SummaryRow label="Geolocalización" value={formatCurrency(breakdown.monthlyGeolocation)} />
          <div className="border-t border-stone-200 pt-1">
            <SummaryRow label="Mensual estimado" value={formatCurrency(breakdown.monthlySubtotal)} emphasized />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-semibold text-stone-900">
            <ShieldCheck className="h-4 w-4" />
            Arranque y garantía
          </div>
          <SummaryRow label="Setup de desarrollo" value={formatCurrency(breakdown.setupDevelopment)} />
          <SummaryRow label="Alta de plantillas WhatsApp" value={formatCurrency(breakdown.setupWhatsAppTemplates)} />
          <SummaryRow label="Costo de setup" value={formatCurrency(breakdown.setupSubtotal)} emphasized />
          <SummaryRow label="Depósito de garantía (2x minutos)" value={formatCurrency(breakdown.guaranteeDeposit)} emphasized />
          <div className="border-t border-stone-200 pt-1">
            <SummaryRow label="Total de arranque estimado" value={formatCurrency(breakdown.totalStartup)} emphasized />
          </div>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900">
          El depósito de garantía es reembolsable al finalizar el servicio y se utiliza únicamente para sostener la
          continuidad operativa en caso de atraso de pago.
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Button type="button" onClick={onPrint}>
            Imprimir / PDF
          </Button>
          <Button asChild variant="outline">
            <a href={whatsappHref} target="_blank" rel="noreferrer">
              Continuar por WhatsApp
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
