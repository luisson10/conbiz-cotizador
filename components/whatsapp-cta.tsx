import { MessageCircleMore } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type WhatsAppCTAProps = {
  href: string;
};

export function WhatsAppCTA({ href }: WhatsAppCTAProps) {
  return (
    <Card className="overflow-hidden bg-stone-950 text-stone-50">
      <CardHeader>
        <CardTitle className="text-stone-50">¿Listo para aterrizar esta cotización?</CardTitle>
        <CardDescription className="text-stone-300">
          Comparte el resumen con tu equipo o abre la conversación comercial con una cotización ya estructurada.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-2xl text-sm leading-relaxed text-stone-300">
          El flujo de esta página es libre y sin fricción: calculas, imprimes si lo necesitas y puedes continuar por
          WhatsApp con un mensaje prellenado.
        </p>
        <Button asChild variant="secondary">
          <a href={href} target="_blank" rel="noreferrer">
            Abrir WhatsApp
            <MessageCircleMore className="h-4 w-4" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
