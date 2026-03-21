import { FileDown, Printer } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type PdfExportCtaProps = {
  onPrint: () => void;
};

export function PdfExportCta({ onPrint }: PdfExportCtaProps) {
  return (
    <Card className="overflow-hidden bg-stone-950 text-stone-50">
      <CardHeader>
        <CardTitle className="text-stone-50">Exporta la cotización a PDF</CardTitle>
        <CardDescription className="text-stone-300">
          Imprime o guarda la cotización final con el desglose completo, listo para enviar al cliente.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-2xl text-sm leading-relaxed text-stone-300">
          El flujo es libre y sin fricción: ajusta el escenario, revisa el resumen y genera un PDF desde el navegador.
        </p>
        <Button variant="secondary" onClick={onPrint}>
          <Printer className="h-4 w-4" />
          Imprimir
          <FileDown className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
