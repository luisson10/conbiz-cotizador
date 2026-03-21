import type { PricingMode } from "@/lib/pricing";
import { formatNumber } from "@/lib/utils";

type CurrencyCode = "USD" | "MXN";

type PrintableQuoteViewProps = {
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
  exchangeRate: number | null;
  exchangeRateDate: string | null;
  exchangeRateSource: string | null;
};

function money(value: number, currency: CurrencyCode, exchangeRate: number | null) {
  const converted = currency === "MXN" && exchangeRate ? value * exchangeRate : value;
  const displayCurrency = currency === "MXN" && exchangeRate ? "MXN" : "USD";
  return new Intl.NumberFormat(displayCurrency === "MXN" ? "es-MX" : "en-US", {
    style: "currency",
    currency: displayCurrency,
    maximumFractionDigits: 2,
  }).format(converted);
}

export function PrintableQuoteView({
  mode,
  minuteRate,
  minutes,
  setupSubtotal,
  monthlySubtotal,
  guaranteeDeposit,
  totalStartup,
  globalMonthlySubtotal,
  platformMonthlySubtotal,
  agents,
  currency,
  exchangeRate,
  exchangeRateDate,
  exchangeRateSource,
}: PrintableQuoteViewProps) {
  const upfrontTotal = setupSubtotal + guaranteeDeposit;
  const firstMonthTotal = upfrontTotal + monthlySubtotal;
  const secondMonthTotal = monthlySubtotal;

  return (
    <section className="printable-area hidden print:block">
      <div className="space-y-8 p-10">
        <div className="flex items-center justify-between border-b border-stone-200 pb-6">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-stone-500">Conbiz</p>
            <h1 className="mt-2 text-3xl font-semibold text-stone-950">Resumen de cotización</h1>
          </div>
          <div className="text-right text-sm text-stone-600">
            <p>Esquema: {mode === "client" ? "Cliente final" : "Reseller"}</p>
            <p>Minutos globales: {formatNumber(minutes)}</p>
            <p>Tipo de cambio: {currency === "MXN" && exchangeRate ? `${exchangeRate.toFixed(4)} MXN/USD` : "USD"}</p>
            {exchangeRateDate ? <p>{exchangeRateDate}</p> : null}
            {exchangeRateSource ? <p>{exchangeRateSource}</p> : null}
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-stone-950">Setup</h2>
            <div className="rounded-2xl border border-stone-200 p-4">
              <div className="flex justify-between py-2 text-sm">
                <span>Desarrollo de agentes</span>
                <span>{money(setupSubtotal, currency, exchangeRate)}</span>
              </div>
              <div className="mt-2 flex justify-between border-t border-stone-200 pt-3 font-semibold">
                <span>Total setup</span>
                <span>{money(setupSubtotal, currency, exchangeRate)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-stone-950">Mensual</h2>
            <div className="rounded-2xl border border-stone-200 p-4">
              <div className="flex justify-between py-2 text-sm">
                <span>Minutos globales</span>
                <span>{money(globalMonthlySubtotal, currency, exchangeRate)}</span>
              </div>
              <div className="flex justify-between py-2 text-sm">
                <span>Plataforma Conbiz</span>
                <span>{money(platformMonthlySubtotal, currency, exchangeRate)}</span>
              </div>
              {agents.map((agent) => (
                <div key={`${agent.id}-monthly`} className="py-2 text-sm">
                  <div className="flex justify-between gap-4">
                    <span>{agent.name}</span>
                    <span>{money(agent.monthlySubtotal, currency, exchangeRate)}</span>
                  </div>
                  <div className="mt-1 space-y-1">
                    {agent.monthlyDetails.map((item) => (
                      <div key={`${item.label}-${item.value}`} className="flex justify-between gap-4 text-xs text-stone-500">
                        <span>{item.label}</span>
                        <span>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div className="mt-2 flex justify-between border-t border-stone-200 pt-3 font-semibold">
                <span>Total mensual</span>
                <span>{money(monthlySubtotal, currency, exchangeRate)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
          <div className="flex justify-between py-2 text-sm">
            <span>Desarrollo de agentes</span>
            <span>{money(setupSubtotal, currency, exchangeRate)}</span>
          </div>
          <div className="flex justify-between py-2 text-sm">
            <span>Depósito de garantía</span>
            <span>{money(guaranteeDeposit, currency, exchangeRate)}</span>
          </div>
          <div className="mt-2 flex justify-between border-t border-stone-300 pt-3 text-lg font-semibold">
            <span>Total de arranque estimado</span>
            <span>{money(upfrontTotal, currency, exchangeRate)}</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-stone-600">
            El depósito es reembolsable al finalizar el servicio y los minutos mensuales contratados no se acumulan al
            siguiente periodo.
          </p>
        </div>

        <div className="rounded-2xl border border-stone-200 p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-stone-500">Totales clave</p>
          <div className="mt-3 flex justify-between py-2 text-sm font-semibold">
            <span>Total primer mes</span>
            <span>{money(firstMonthTotal, currency, exchangeRate)}</span>
          </div>
          <div className="mt-2 flex justify-between border-t border-stone-200 pt-3 text-sm font-semibold">
            <span>Total a partir del segundo mes</span>
            <span>{money(secondMonthTotal, currency, exchangeRate)}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
