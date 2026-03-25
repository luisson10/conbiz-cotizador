import { BrainCircuit, Building2, Gauge, MessageSquareText, TimerReset } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ITEMS = [
  {
    title: "Setup de agente",
    description: "Base de 100 horas de desarrollo. Puede subir o bajar según alcance, integraciones y flujos requeridos.",
    icon: BrainCircuit,
  },
  {
    title: "Minutos mensuales",
    description: "El servicio opera en prepago. El cliente define un volumen mensual estimado y ese bloque se paga por adelantado.",
    icon: TimerReset,
  },
  {
    title: "Concurrencia",
    description: "Cada concurrencia representa la capacidad del agente para atender llamadas simultáneas sin degradar el servicio.",
    icon: Gauge,
  },
  {
    title: "Herramientas inteligentes",
    description: "Se activan por concurrencia para dar capacidades como automatización externa, orquestación y herramientas especializadas.",
    icon: MessageSquareText,
  },
  {
    title: "Plataforma Conbiz",
    description: "Renta mensual para monitoreo, gestión, visibilidad operativa y administración centralizada del agente.",
    icon: Building2,
  },
];

export function BusinessModelExplainer() {
  return (
    <section id="modelo" className="space-y-6">
      <div className="max-w-3xl space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">Modelo de negocio</p>
        <h2 className="text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
          Una estructura clara: setup, operación mensual y garantía de continuidad.
        </h2>
        <p className="text-base leading-7 text-stone-600">
          El objetivo de la cotización es separar lo que corresponde al arranque técnico, lo que se consume cada mes
          y el depósito que garantiza continuidad operativa ante atrasos de pago.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {ITEMS.map((item) => {
          const Icon = item.icon;

          return (
            <Card key={item.title} className="h-full bg-stone-50/70">
              <CardHeader>
                <div className="w-fit rounded-2xl border border-stone-200 bg-white p-3">
                  <Icon className="h-5 w-5 text-stone-800" />
                </div>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent />
            </Card>
          );
        })}
      </div>
    </section>
  );
}
