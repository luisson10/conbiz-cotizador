import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TermsSection() {
  return (
    <section id="terminos" className="space-y-6">
      <div className="max-w-3xl space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">Términos comerciales</p>
        <h2 className="text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
          Condiciones comerciales
        </h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Condiciones generales</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2 text-sm leading-relaxed text-stone-700">
            <p><strong>Moneda:</strong> USD</p>
            <p><strong>Forma de pago:</strong> Pagos únicos 60 % anticipo, 40 % contra entrega. Mensualidades 100% pago anticipado.</p>
            <p><strong>Plazo de contratación:</strong> 12 meses</p>
            <p><strong>Vigencia de la propuesta:</strong> 30 días naturales.</p>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-stone-600 italic space-y-2">
            <p>
              NOTA 1: Los precios especificados pueden variar, durante la vigencia del contrato, de acuerdo con las políticas de uso y consumo de terceros con los que Assetel tiene convenio para la prestación de este servicio, o en caso de aplicación de impuestos locales por uso de plataformas internacionales de terceros.
            </p>
            <p>
              NOTA 2: Los precios de los servicios y componentes de terceros utilizados en la solución Assetel/Conbiz se encuentran denominados en dólares estadounidenses. En consecuencia, el costo de los consumos asociados al servicio podrá ajustarse en caso de que el tipo de cambio del dólar presente una variación superior al <strong>10 %</strong> respecto al tipo de cambio vigente a la fecha de formalización del contrato.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Facturación y soporte</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm leading-relaxed text-stone-700">
            <strong>Facturación:</strong> El pago puede ser en moneda nacional MXN al tipo de cambio proporcionado por Assetel el día de la operación, o en dólares americanos USD. Se emite CFDI bajo el código SmartSIDE@Conbiz AI.
          </div>
          <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm leading-relaxed text-stone-700">
            <strong>Soporte adicional:</strong> Desarrollo fuera de lo incluido en el alcance – $1,400 MXN/h + IVA
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bolsa de minutos</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm leading-relaxed text-stone-700">
            Son los minutos mensuales del servicio de Agente Virtual Conversacional Assetel/Conbiz, los cuales son utilizados y consumidos en el mes, son en modo prepago y no son acumulables para el siguiente mes.
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Depósito de garantía</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm leading-relaxed text-stone-700">
            El depósito tiene como objetivo amortizar posibles consumos adicionales que el cliente pudiera generar en algún mes. Este depósito es reintegrable al finalizar el contrato o la relación comercial.
          </div>
          <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm leading-relaxed text-stone-700">
            <strong>Los minutos excedentes del mes en curso, se facturarán de acuerdo con la tarifa vigente en la cotización/contrato en el mes siguiente.</strong>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-stone-600 italic">
            Si durante tres meses consecutivos el cliente excede los minutos de la bolsa mensual, se recomendará ajustar su bolsa de minutos con base en el promedio de tráfico real, a fin de garantizar la continuidad del servicio y optimizar su plan.
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Condiciones operativas</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {[
            "El servicio opera en modalidad prepago. La activación mensual requiere pago previo del volumen de minutos definido para ese periodo.",
            "Los minutos contratados son mensuales y no se acumulan para el mes siguiente si no se consumen.",
            "El cliente debe estimar el volumen mensual de minutos requerido para asegurar continuidad operativa.",
            "Se requiere un depósito de garantía equivalente a 2x la primera renta de minutos.",
            "El depósito de garantía se devuelve en su totalidad al terminar el servicio, sujeto al cierre correcto de la cuenta y obligaciones pendientes.",
            "El depósito podrá utilizarse de forma temporal para garantizar continuidad del servicio ante atraso o incumplimiento de pago.",
            "La concurrencia es la cantidad de llamadas simultáneas que un mismo agente puede sostener.",
            "Los costos globales incluyen minutos y, si se activa, la renta de plataforma Conbiz para toda la operación.",
            "Los costos por agente incluyen desarrollo, concurrencia, herramientas inteligentes, geolocalización y cualquier renta mensual personalizada.",
            "Las herramientas inteligentes personalizadas para aplicativos específicos se cotizan como renta mensual independiente en lugar de desarrollo inicial.",
          ].map((term) => (
            <div key={term} className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm leading-relaxed text-stone-700">
              {term}
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
