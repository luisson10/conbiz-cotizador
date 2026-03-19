"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { QuoteInputs } from "@/lib/pricing";

type QuoteCalculatorFormProps = {
  inputs: QuoteInputs;
  onChange: <K extends keyof QuoteInputs>(key: K, value: QuoteInputs[K]) => void;
};

function NumberField({
  id,
  label,
  description,
  value,
  onChange,
  min = 0,
  step = 1,
}: {
  id: string;
  label: string;
  description: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  step?: number;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="number"
        min={min}
        step={step}
        value={Number.isNaN(value) ? "" : value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <p className="text-xs leading-relaxed text-stone-500">{description}</p>
    </div>
  );
}

function ToggleRow({
  title,
  description,
  checked,
  onCheckedChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-stone-200 bg-stone-50 p-4">
      <div className="space-y-1">
        <p className="text-sm font-medium text-stone-900">{title}</p>
        <p className="text-xs leading-relaxed text-stone-500">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

export function QuoteCalculatorForm({ inputs, onChange }: QuoteCalculatorFormProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Volumen operativo</CardTitle>
          <CardDescription>Define la base mensual para minutos, concurrencia y costo de arranque.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-2">
          <NumberField
            id="minutes"
            label="Minutos mensuales estimados"
            description="Los minutos son prepago y no se acumulan al siguiente mes."
            value={inputs.minutes}
            onChange={(value) => onChange("minutes", value)}
          />
          <NumberField
            id="concurrency"
            label="Concurrencia requerida"
            description="Cada unidad habilita llamadas simultáneas del mismo agente."
            value={inputs.concurrency}
            onChange={(value) => onChange("concurrency", value)}
          />
          <NumberField
            id="developmentHours"
            label="Horas de desarrollo"
            description="Base referencial de 100 horas incluidas en el setup inicial."
            value={inputs.developmentHours}
            onChange={(value) => onChange("developmentHours", value)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Renta mensual</CardTitle>
          <CardDescription>Activa o desactiva los módulos fijos de plataforma y herramientas inteligentes.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <ToggleRow
            title="Renta de plataforma Conbiz"
            description="Incluye monitoreo, gestión y administración centralizada del agente."
            checked={inputs.includePlatform}
            onCheckedChange={(checked) => onChange("includePlatform", checked)}
          />
          <ToggleRow
            title="Herramientas inteligentes base"
            description="Se cobran por concurrencia y habilitan acciones inteligentes reutilizables."
            checked={inputs.includeIntelligentTools}
            onCheckedChange={(checked) => onChange("includeIntelligentTools", checked)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Canales y consumo adicional</CardTitle>
          <CardDescription>WhatsApp y geolocalización se agregan como cargos según uso.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <ToggleRow
            title="Activar WhatsApp"
            description="Incluye mensajes por plantilla y costo de alta de templates."
            checked={inputs.useWhatsApp}
            onCheckedChange={(checked) => onChange("useWhatsApp", checked)}
          />

          {inputs.useWhatsApp ? (
            <div className="grid gap-5 md:grid-cols-3">
              <NumberField
                id="marketingMessages"
                label="Mensajes marketing"
                description="Plantillas promocionales aprobadas por Meta."
                value={inputs.marketingMessages}
                onChange={(value) => onChange("marketingMessages", value)}
              />
              <NumberField
                id="utilityMessages"
                label="Mensajes utilidad"
                description="Plantillas operativas o transaccionales."
                value={inputs.utilityMessages}
                onChange={(value) => onChange("utilityMessages", value)}
              />
              <NumberField
                id="whatsappTemplates"
                label="Plantillas a crear"
                description="Alta inicial de plantillas para WhatsApp."
                value={inputs.whatsappTemplates}
                onChange={(value) => onChange("whatsappTemplates", value)}
              />
            </div>
          ) : null}

          <NumberField
            id="geolocationQueries"
            label="Consultas de geolocalización"
            description="Consultas mensuales para ubicar direcciones y puntos geográficos en México."
            value={inputs.geolocationQueries}
            onChange={(value) => onChange("geolocationQueries", value)}
          />

          <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-600">
            Herramientas inteligentes personalizadas se cotizan como una renta mensual independiente y no entran en
            esta fórmula automática.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
