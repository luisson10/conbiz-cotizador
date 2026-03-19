import type { PricingMode, QuoteBreakdown, QuoteInputs } from "@/lib/pricing";
import { formatCurrency, formatNumber } from "@/lib/utils";

type PrintableQuoteViewProps = {
  mode: PricingMode;
  inputs: QuoteInputs;
  breakdown: QuoteBreakdown;
};

export function PrintableQuoteView({ mode, inputs, breakdown }: PrintableQuoteViewProps) {
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
            <p>Minutos estimados: {formatNumber(inputs.minutes)}</p>
            <p>Concurrencia: {formatNumber(inputs.concurrency)}</p>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-stone-950">Setup</h2>
            <div className="rounded-2xl border border-stone-200 p-4">
              <div className="flex justify-between py-2 text-sm">
                <span>Desarrollo ({inputs.developmentHours} horas)</span>
                <span>{formatCurrency(breakdown.setupDevelopment)}</span>
              </div>
              <div className="flex justify-between py-2 text-sm">
                <span>Plantillas WhatsApp</span>
                <span>{formatCurrency(breakdown.setupWhatsAppTemplates)}</span>
              </div>
              <div className="mt-2 flex justify-between border-t border-stone-200 pt-3 font-semibold">
                <span>Total setup</span>
                <span>{formatCurrency(breakdown.setupSubtotal)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-stone-950">Mensual</h2>
            <div className="rounded-2xl border border-stone-200 p-4">
              <div className="flex justify-between py-2 text-sm">
                <span>Minutos</span>
                <span>{formatCurrency(breakdown.monthlyMinutes)}</span>
              </div>
              <div className="flex justify-between py-2 text-sm">
                <span>Concurrencia</span>
                <span>{formatCurrency(breakdown.monthlyConcurrency)}</span>
              </div>
              <div className="flex justify-between py-2 text-sm">
                <span>Herramientas inteligentes</span>
                <span>{formatCurrency(breakdown.monthlyToolsBase)}</span>
              </div>
              <div className="flex justify-between py-2 text-sm">
                <span>Plataforma Conbiz</span>
                <span>{formatCurrency(breakdown.monthlyPlatform)}</span>
              </div>
              <div className="flex justify-between py-2 text-sm">
                <span>WhatsApp</span>
                <span>{formatCurrency(breakdown.monthlyWhatsAppMarketing + breakdown.monthlyWhatsAppUtility)}</span>
              </div>
              <div className="flex justify-between py-2 text-sm">
                <span>Geolocalización</span>
                <span>{formatCurrency(breakdown.monthlyGeolocation)}</span>
              </div>
              <div className="mt-2 flex justify-between border-t border-stone-200 pt-3 font-semibold">
                <span>Total mensual</span>
                <span>{formatCurrency(breakdown.monthlySubtotal)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
          <div className="flex justify-between py-2 text-sm">
            <span>Depósito de garantía</span>
            <span>{formatCurrency(breakdown.guaranteeDeposit)}</span>
          </div>
          <div className="mt-2 flex justify-between border-t border-stone-300 pt-3 text-lg font-semibold">
            <span>Total de arranque estimado</span>
            <span>{formatCurrency(breakdown.totalStartup)}</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-stone-600">
            El depósito es reembolsable al finalizar el servicio y los minutos mensuales contratados no se acumulan al
            siguiente periodo.
          </p>
        </div>
      </div>
    </section>
  );
}
