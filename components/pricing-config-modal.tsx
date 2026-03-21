"use client";

import { Settings2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { PricingConfig } from "@/lib/pricing";

type PricingConfigModalProps = {
  open: boolean;
  pricing: PricingConfig;
  onClose: () => void;
  onChange: (pricing: PricingConfig) => void;
  onReset: () => void;
};

type FieldProps = {
  id: string;
  label: string;
  value: number;
  description: string;
  onChange: (value: number) => void;
  step?: number;
};

function PricingField({ id, label, value, description, onChange, step = 0.01 }: FieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="number"
        step={step}
        value={Number.isNaN(value) ? "" : value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <p className="text-xs leading-relaxed text-stone-500">{description}</p>
    </div>
  );
}

export function PricingConfigModal({ open, pricing, onClose, onChange, onReset }: PricingConfigModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/35 p-4 backdrop-blur-sm">
      <Card className="max-h-[88vh] w-full max-w-4xl overflow-hidden">
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
                Edita las tarifas base que usa el cotizador. Los cambios se aplican en tiempo real.
              </CardDescription>
            </div>
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="max-h-[calc(88vh-96px)] space-y-8 overflow-y-auto p-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4 rounded-3xl border border-stone-200 bg-stone-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Tarifas base</p>
              <div className="grid gap-4">
                <PricingField
                  id="minute-client"
                  label="Minuto cliente final"
                  value={pricing.minuteRate.client}
                  description="Tarifa por minuto para cotización retail."
                  onChange={(value) =>
                    onChange({ ...pricing, minuteRate: { ...pricing.minuteRate, client: value } })
                  }
                />
                <PricingField
                  id="minute-reseller"
                  label="Minuto reseller"
                  value={pricing.minuteRate.reseller}
                  description="Tarifa por minuto para asociados."
                  onChange={(value) =>
                    onChange({ ...pricing, minuteRate: { ...pricing.minuteRate, reseller: value } })
                  }
                />
                <PricingField
                  id="platform"
                  label="Plataforma Conbiz"
                  value={pricing.platform}
                  description="Renta mensual global."
                  onChange={(value) => onChange({ ...pricing, platform: value })}
                />
                <PricingField
                  id="concurrency"
                  label="Concurrencia"
                  value={pricing.concurrency}
                  description="Costo mensual por concurrencia."
                  onChange={(value) => onChange({ ...pricing, concurrency: value })}
                />
                <PricingField
                  id="tool-base"
                  label="Herramienta inteligente por concurrencia"
                  value={pricing.intelligentTool}
                  description="Se cobra por cada herramienta activa y por concurrencia."
                  onChange={(value) => onChange({ ...pricing, intelligentTool: value })}
                />
              </div>
            </div>

            <div className="space-y-4 rounded-3xl border border-stone-200 bg-stone-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Setup y consumos</p>
              <div className="grid gap-4">
                <PricingField
                  id="dev-base-price"
                  label="Desarrollo base"
                  value={pricing.developmentBasePrice}
                  description="Costo base para el paquete de horas de desarrollo."
                  onChange={(value) => onChange({ ...pricing, developmentBasePrice: value })}
                />
                <PricingField
                  id="dev-base-hours"
                  label="Horas base"
                  value={pricing.developmentBaseHours}
                  description="Horas incluidas en el costo base de desarrollo."
                  onChange={(value) => onChange({ ...pricing, developmentBaseHours: value })}
                  step={1}
                />
                <PricingField
                  id="geo"
                  label="Geolocalización"
                  value={pricing.geolocation}
                  description="Costo por consulta."
                  onChange={(value) => onChange({ ...pricing, geolocation: value })}
                />
                <PricingField
                  id="wa-marketing"
                  label="WhatsApp marketing"
                  value={pricing.whatsappMarketing}
                  description="Costo por mensaje marketing."
                  onChange={(value) => onChange({ ...pricing, whatsappMarketing: value })}
                />
                <PricingField
                  id="wa-utility"
                  label="WhatsApp utilitarios"
                  value={pricing.whatsappUtility}
                  description="Costo por mensaje utilitario."
                  onChange={(value) => onChange({ ...pricing, whatsappUtility: value })}
                />
                <PricingField
                  id="wa-template"
                  label="Plantilla WhatsApp"
                  value={pricing.whatsappTemplate}
                  description="Costo por alta de plantilla."
                  onChange={(value) => onChange({ ...pricing, whatsappTemplate: value })}
                />
              </div>
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
