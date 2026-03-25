import { Calculator, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PricingMode } from "@/lib/pricing";
import { formatMoney, formatNumber, type CurrencyCode } from "@/lib/utils";

type QuoteSummaryCardProps = {
  mode: PricingMode;
  minuteRate: number;
  minutes: number;
  setupSubtotal: number;
  monthlySubtotal: number;
  guaranteeDeposit: number;
  totalStartup: number;
  globalMonthlySubtotal: number;
  platformMonthlySubtotal: number;
  agents: Array<{
    id: string;
    name: string;
    setupSubtotal: number;
    monthlySubtotal: number;
    monthlyDetails: Array<{ label: string; value: string }>;
  }>;
  currency: CurrencyCode;
  onCurrencyChange: (currency: CurrencyCode) => void;
  exchangeRate: number | null;
  exchangeRateDate: string | null;
  exchangeRateSource: string | null;
  isFallback?: boolean;
  onPrint: () => void;
};

function SummaryRow({
  label,
  value,
  description,
  detailStack,
  valueHint,
  valueSuffix,
  emphasized = false,
}: {
  label: string;
  value: string;
  description?: string;
  detailStack?: Array<{ label: string; value: string }>;
  valueHint?: string;
  valueSuffix?: string;
  emphasized?: boolean;
}) {
  return (
    <div className="py-2 text-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className={emphasized ? "font-medium text-stone-900" : "text-stone-600"}>{label}</div>
          {description ? <div className="mt-1 text-xs leading-relaxed text-stone-500">{description}</div> : null}
        </div>
        <div className="min-w-[96px] text-right">
          <div className={emphasized ? "font-semibold text-stone-950" : "font-medium text-stone-900"}>
            {value}
            {valueSuffix ? <span className="ml-1 text-xs font-medium uppercase text-stone-400">{valueSuffix}</span> : null}
          </div>
          {valueHint ? <div className="mt-1 block text-right text-xs text-stone-400">{valueHint}</div> : null}
        </div>
      </div>
      {detailStack?.length ? (
        <div className="mt-1 space-y-1">
          {detailStack.map((item) => (
            <div key={`${item.label}-${item.value}`} className="flex items-start justify-between gap-4 text-xs leading-relaxed text-stone-500">
              <span className="min-w-0">{item.label}</span>
              <span className="min-w-[96px] whitespace-nowrap text-right">{item.value}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function QuoteSummaryCard({
  mode,
  minuteRate,
  minutes,
  setupSubtotal,
  monthlySubtotal,
  guaranteeDeposit,
  globalMonthlySubtotal,
  platformMonthlySubtotal,
  agents,
  currency,
  onCurrencyChange,
  exchangeRate,
  exchangeRateDate,
  exchangeRateSource,
  isFallback = false,
  onPrint,
}: QuoteSummaryCardProps) {
  const modeLabel = mode === "client" ? "Cliente final" : "Reseller";
  const totalCurrencyLabel = currency === "MXN" && exchangeRate ? "MXN" : "USD";
  const upfrontTotal = setupSubtotal + guaranteeDeposit;
  const firstMonthTotal = upfrontTotal + monthlySubtotal;
  const secondMonthTotal = monthlySubtotal;
  const setupDescription = agents.map((agent) => agent.name).join(" · ");

  return (
    <Card className="sticky top-6 overflow-hidden">
      <CardHeader className="border-b border-stone-200 bg-stone-50">
        <div className="flex items-center justify-between gap-4">
          <CardTitle>Resumen de cotización</CardTitle>
          <div className="whitespace-nowrap rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-medium text-stone-700">
            {modeLabel}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="rounded-2xl border border-stone-200 bg-white p-4">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-stone-500">
              Moneda <span className="normal-case tracking-normal text-stone-400">· tipo de cambio Banxico</span>
            </p>
            <div className="inline-flex rounded-full border border-stone-200 bg-stone-100 p-1">
              <button
                type="button"
                className={`min-w-16 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  currency === "USD" ? "bg-stone-950 text-white shadow-sm" : "text-stone-600"
                }`}
                onClick={() => onCurrencyChange("USD")}
              >
                USD
              </button>
              <button
                type="button"
                className={`min-w-16 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  currency === "MXN" ? "bg-stone-950 text-white shadow-sm" : "text-stone-600"
                }`}
                onClick={() => onCurrencyChange("MXN")}
              >
                MXN
              </button>
            </div>
          </div>
          <div className="mt-2 text-[11px] leading-relaxed text-stone-500">
            {exchangeRate ? (
              <p>
                FIX {exchangeRate.toFixed(4)} MXN/USD
                {exchangeRateDate ? ` · ${exchangeRateDate}` : ""}
                {exchangeRateSource ? ` · ${exchangeRateSource}` : ""}
                {isFallback ? (
                  <span className="ml-1 text-amber-600" title="Tipo de cambio estimado (Banxico no disponible)">
                    (estimado)
                  </span>
                ) : null}
              </p>
            ) : (
              <p>Si Banxico no responde, la vista permanece en USD.</p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-stone-500">Tarifa por minuto</p>
          <div className="mt-2 flex items-end justify-between gap-4">
            <p className="text-3xl font-semibold tracking-tight text-stone-950">{formatMoney(minuteRate, currency, exchangeRate)}</p>
            <p className="text-sm text-stone-500">{formatNumber(minutes)} min/mes</p>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-semibold text-stone-900">
            <Calculator className="h-4 w-4" />
            Desglose mensual
          </div>
          <SummaryRow
            label="Minutos globales"
            description={`${formatNumber(minutes)} minutos totales x ${formatMoney(minuteRate, currency, exchangeRate)}`}
            value={formatMoney(globalMonthlySubtotal, currency, exchangeRate)}
          />
          <SummaryRow
            label="Plataforma Conbiz"
            description="Renta mensual global de monitoreo y gestión."
            value={formatMoney(platformMonthlySubtotal, currency, exchangeRate)}
          />
          {agents.map((agent) => (
            <SummaryRow
              key={agent.id}
              label={agent.name}
              detailStack={agent.monthlyDetails}
              value={formatMoney(agent.monthlySubtotal, currency, exchangeRate)}
            />
          ))}
          <div className="border-t border-stone-200 pt-1">
            <SummaryRow
              label="Mensual estimado"
              value={formatMoney(monthlySubtotal, currency, exchangeRate)}
              valueSuffix={totalCurrencyLabel}
              emphasized
            />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-semibold text-stone-900">
            <ShieldCheck className="h-4 w-4" />
            Arranque y garantía
          </div>
          <SummaryRow
            label="Desarrollo de agentes"
            description={setupDescription}
            value={formatMoney(setupSubtotal, currency, exchangeRate)}
            valueSuffix={totalCurrencyLabel}
            emphasized
          />
          <SummaryRow
            label="Depósito de garantía (2x minutos)"
            description="Respalda continuidad del servicio y es reembolsable al terminar."
            value={formatMoney(guaranteeDeposit, currency, exchangeRate)}
            valueSuffix={totalCurrencyLabel}
            emphasized
          />
          <div className="border-t border-stone-200 pt-1">
            <SummaryRow
              label="Total de arranque estimado"
              value={formatMoney(upfrontTotal, currency, exchangeRate)}
              valueSuffix={totalCurrencyLabel}
              emphasized
            />
          </div>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-stone-500">Totales clave</p>
          <div className="mt-3 space-y-1">
            <SummaryRow
              label="Total primer mes"
              value={formatMoney(firstMonthTotal, currency, exchangeRate)}
              valueSuffix={totalCurrencyLabel}
              emphasized
            />
            <div className="border-t border-stone-200 pt-1">
              <SummaryRow
                label="Total a partir del segundo mes"
                value={formatMoney(secondMonthTotal, currency, exchangeRate)}
                valueSuffix={totalCurrencyLabel}
                emphasized
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900">
          El depósito de garantía es reembolsable al finalizar el servicio y se utiliza únicamente para sostener la
          continuidad operativa en caso de atraso de pago.
        </div>

        <Button type="button" onClick={onPrint}>
          Imprimir / PDF
        </Button>
      </CardContent>
    </Card>
  );
}
