"use client";

import { BadgeDollarSign, Handshake } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { PricingMode } from "@/lib/pricing";

type PricingModeToggleProps = {
  mode: PricingMode;
  onChange: (mode: PricingMode) => void;
};

const MODES = [
  {
    id: "client" as const,
    label: "Cliente final",
    description: "List price recomendado para operación directa con Conbiz.",
    icon: BadgeDollarSign,
  },
  {
    id: "reseller" as const,
    label: "Reseller",
    description: "Esquema para asociados con tarifa preferencial por minuto.",
    icon: Handshake,
  },
];

export function PricingModeToggle({ mode, onChange }: PricingModeToggleProps) {
  return (
    <Card className="grid gap-3 p-3 sm:grid-cols-2">
      {MODES.map((item) => {
        const Icon = item.icon;
        const active = mode === item.id;

        return (
          <Button
            key={item.id}
            type="button"
            variant={active ? "default" : "ghost"}
            className={cn(
              "h-auto items-start justify-start rounded-2xl px-4 py-4 text-left",
              active ? "border border-stone-900" : "border border-transparent bg-stone-50 text-stone-700 hover:bg-stone-100",
            )}
            onClick={() => onChange(item.id)}
          >
            <div className="flex items-start gap-3">
              <div className={cn("rounded-xl p-2", active ? "bg-white/10" : "bg-white")}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <div className="text-sm font-semibold">{item.label}</div>
                <div className={cn("text-xs leading-relaxed", active ? "text-stone-200" : "text-stone-500")}>
                  {item.description}
                </div>
              </div>
            </div>
          </Button>
        );
      })}
    </Card>
  );
}
