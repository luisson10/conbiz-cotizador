"use client";

import { Boxes, MapPinned, MessageSquareText, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { AgentQuoteInputs, GlobalQuoteInputs } from "@/lib/pricing";

type QuoteCalculatorFormProps = {
  globalInputs: GlobalQuoteInputs;
  agents: AgentQuoteInputs[];
  onGlobalChange: <K extends keyof GlobalQuoteInputs>(key: K, value: GlobalQuoteInputs[K]) => void;
  onAgentChange: <K extends keyof AgentQuoteInputs>(agentId: string, key: K, value: AgentQuoteInputs[K]) => void;
  onAddAgent: () => void;
  onRemoveAgent: (agentId: string) => void;
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

function ToolToggleRow({
  title,
  description,
  checked,
  onCheckedChange,
  icon,
}: {
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-stone-200 bg-white p-4 shadow-[0_8px_24px_-20px_rgba(28,25,23,0.35)]">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-stone-200 bg-stone-50 text-stone-700">
            {icon}
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-stone-900">{title}</p>
            <p className="text-xs leading-relaxed text-stone-500">{description}</p>
          </div>
        </div>
        <Switch checked={checked} onCheckedChange={onCheckedChange} />
      </div>
    </div>
  );
}

export function QuoteCalculatorForm({
  globalInputs,
  agents,
  onGlobalChange,
  onAgentChange,
  onAddAgent,
  onRemoveAgent,
}: QuoteCalculatorFormProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Configuración global</CardTitle>
          <CardDescription>Minutos y plataforma aplican a toda la operación, no a un agente individual.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-2">
          <NumberField
            id="minutes"
            label="Minutos mensuales estimados"
            description="Los minutos son prepago y no se acumulan al siguiente mes."
            value={globalInputs.minutes}
            onChange={(value) => onGlobalChange("minutes", value)}
          />
          <ToggleRow
            title="Renta de plataforma Conbiz"
            description="Cargo mensual global para monitoreo, gestión y administración centralizada."
            checked={globalInputs.includePlatform}
            onCheckedChange={(checked) => onGlobalChange("includePlatform", checked)}
          />
        </CardContent>
      </Card>

      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-stone-950">Agentes</h3>
          <p className="text-sm text-stone-600">Cada tarjeta calcula setup y renta mensual de manera independiente.</p>
        </div>
        <Button type="button" variant="outline" onClick={onAddAgent}>
          <Plus className="h-4 w-4" />
          Agregar agente
        </Button>
      </div>

      {agents.map((agent, index) => (
        <Card key={agent.id}>
          <CardHeader className="border-b border-stone-200">
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle>Agente {index + 1}</CardTitle>
                <CardDescription>Configura desarrollo, concurrencia y add-ons mensuales para este agente.</CardDescription>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemoveAgent(agent.id)}
                disabled={agents.length === 1}
              >
                <Trash2 className="h-4 w-4" />
                Eliminar
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-5 pt-6">
            <div className="space-y-4 rounded-[28px] border border-stone-200 bg-stone-50 p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Base del agente</p>
              </div>
              <div className="grid gap-5 md:grid-cols-3">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor={`name-${agent.id}`}>Nombre del agente</Label>
                  <Input
                    id={`name-${agent.id}`}
                    value={agent.name}
                    onChange={(event) => onAgentChange(agent.id, "name", event.target.value)}
                  />
                  <p className="text-xs leading-relaxed text-stone-500">Usa el nombre comercial o funcional del agente.</p>
                </div>
                <NumberField
                  id={`developmentHours-${agent.id}`}
                  label="Horas de desarrollo"
                  description="Base referencial: 100 horas por $2,800 USD."
                  value={agent.developmentHours}
                  onChange={(value) => onAgentChange(agent.id, "developmentHours", value)}
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <NumberField
                  id={`concurrency-${agent.id}`}
                  label="Concurrencia"
                  description="Capacidad del agente para sostener llamadas simultáneas."
                  value={agent.concurrency}
                  onChange={(value) => onAgentChange(agent.id, "concurrency", value)}
                />
              </div>
            </div>

            <div className="space-y-4 rounded-[28px] border border-stone-200 bg-stone-50 p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Herramientas inteligentes</p>
                <p className="mt-1 text-sm text-stone-600">Activa solo las capacidades que necesite este agente.</p>
              </div>

              <div className="space-y-3">
                <ToolToggleRow
                  title="Geolocalización"
                  description="Búsqueda de ubicaciones exactas y puntos geográficos en México."
                  checked={agent.includeGeolocation}
                  onCheckedChange={(checked) => onAgentChange(agent.id, "includeGeolocation", checked)}
                  icon={<MapPinned className="h-5 w-5" />}
                />
                {agent.includeGeolocation ? (
                  <div className="rounded-3xl border border-stone-200 bg-white p-4">
                    <NumberField
                      id={`geolocationQueries-${agent.id}`}
                      label="Consultas de geolocalización"
                      description="Consumo mensual de este agente."
                      value={agent.geolocationQueries}
                      onChange={(value) => onAgentChange(agent.id, "geolocationQueries", value)}
                    />
                  </div>
                ) : null}

                <ToolToggleRow
                  title="WhatsApp"
                  description="Mensajería saliente con plantillas de marketing y mensajes utilitarios."
                  checked={agent.useWhatsApp}
                  onCheckedChange={(checked) => onAgentChange(agent.id, "useWhatsApp", checked)}
                  icon={<MessageSquareText className="h-5 w-5" />}
                />
                {agent.useWhatsApp ? (
                  <div className="rounded-3xl border border-stone-200 bg-white p-4">
                    <div className="grid gap-5 md:grid-cols-3">
                      <NumberField
                        id={`marketingMessages-${agent.id}`}
                        label="Mensajes marketing"
                        description="Plantillas promocionales aprobadas por Meta."
                        value={agent.marketingMessages}
                        onChange={(value) => onAgentChange(agent.id, "marketingMessages", value)}
                      />
                      <NumberField
                        id={`utilityMessages-${agent.id}`}
                        label="Mensajes utilitarios"
                        description="Plantillas transaccionales u operativas."
                        value={agent.utilityMessages}
                        onChange={(value) => onAgentChange(agent.id, "utilityMessages", value)}
                      />
                      <NumberField
                        id={`whatsappTemplates-${agent.id}`}
                        label="Plantillas a crear"
                        description="Alta inicial de templates para este agente."
                        value={agent.whatsappTemplates}
                        onChange={(value) => onAgentChange(agent.id, "whatsappTemplates", value)}
                      />
                    </div>
                  </div>
                ) : null}

                <ToolToggleRow
                  title="Personalizada"
                  description="Renta mensual para una herramienta desarrollada a la medida."
                  checked={agent.includeCustomTool}
                  onCheckedChange={(checked) => onAgentChange(agent.id, "includeCustomTool", checked)}
                  icon={<Boxes className="h-5 w-5" />}
                />
                {agent.includeCustomTool ? (
                  <div className="rounded-3xl border border-stone-200 bg-white p-4">
                    <div className="grid gap-5 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor={`customToolName-${agent.id}`}>Nombre de la herramienta</Label>
                        <Input
                          id={`customToolName-${agent.id}`}
                          value={agent.customToolName}
                          onChange={(event) => onAgentChange(agent.id, "customToolName", event.target.value)}
                        />
                        <p className="text-xs leading-relaxed text-stone-500">Etiqueta interna o comercial para esta herramienta.</p>
                      </div>
                      <NumberField
                        id={`customToolMonthly-${agent.id}`}
                        label="Renta mensual personalizada"
                        description="Costo mensual específico de esta herramienta."
                        value={agent.customToolMonthly}
                        onChange={(value) => onAgentChange(agent.id, "customToolMonthly", value)}
                        step={0.01}
                      />
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
