import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TERMS = [
  "El servicio opera en modalidad prepago. La activación mensual requiere pago previo del volumen de minutos definido para ese periodo.",
  "Los minutos contratados son mensuales y no se acumulan para el mes siguiente si no se consumen.",
  "El cliente debe estimar el volumen mensual de minutos requerido para asegurar continuidad operativa.",
  "Se requiere un depósito de garantía equivalente a 2x la primera renta de minutos.",
  "El depósito de garantía se devuelve en su totalidad al terminar el servicio, sujeto al cierre correcto de la cuenta y obligaciones pendientes.",
  "El depósito podrá utilizarse de forma temporal para garantizar continuidad del servicio ante atraso o incumplimiento de pago.",
  "La concurrencia es la cantidad de llamadas simultáneas que un mismo agente puede sostener.",
  "Las plantillas de WhatsApp deben darse de alta y Meta determinará si cada plantilla corresponde a marketing o utilidad.",
  "Las herramientas inteligentes personalizadas para aplicativos específicos se cotizan como renta mensual independiente en lugar de desarrollo inicial.",
];

export function TermsSection() {
  return (
    <section id="terminos" className="space-y-6">
      <div className="max-w-3xl space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">Términos comerciales</p>
        <h2 className="text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
          Condiciones operativas para cotizar, activar y mantener el servicio.
        </h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Condiciones clave</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {TERMS.map((term) => (
            <div key={term} className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm leading-relaxed text-stone-700">
              {term}
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
