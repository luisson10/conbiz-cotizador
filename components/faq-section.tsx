import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQS = [
  {
    question: "¿Qué es una concurrencia?",
    answer:
      "Es la capacidad de un mismo agente para sostener llamadas simultáneas. Si tu operación necesita atender más de una llamada al mismo tiempo, debes incrementar la concurrencia.",
  },
  {
    question: "¿Cómo se estiman los minutos mensuales?",
    answer:
      "Se recomienda partir del volumen esperado de llamadas, la duración promedio y un margen operativo. Como el servicio es prepago, conviene definir un bloque que cubra el mes completo.",
  },
  {
    question: "¿Qué incluye el desarrollo base de $2,800 USD?",
    answer:
      "Incluye una referencia de 100 horas de desarrollo para construir el agente, integrar flujos, pruebas iniciales y ajustes base. El total puede variar si el caso de uso requiere más o menos esfuerzo.",
  },
  {
    question: "¿Cuándo conviene activar herramientas inteligentes?",
    answer:
      "Cuando el agente necesita acciones adicionales como automatización, lógica extendida o capacidades más allá de la conversación base. Se cobran por concurrencia activa.",
  },
  {
    question: "¿Qué cosas son globales y cuáles son por agente?",
    answer:
      "Minutos mensuales y plataforma Conbiz viven a nivel global. Desarrollo, concurrencia, herramientas inteligentes, geolocalización y rentas personalizadas se configuran por cada agente dentro de la cotización.",
  },
  {
    question: "¿Qué cubre la plataforma Conbiz?",
    answer:
      "Cubre monitoreo, gestión, administración y visibilidad operativa del agente desde una plataforma centralizada. Se cobra como renta mensual fija.",
  },
  {
    question: "¿Cómo funciona el depósito de garantía?",
    answer:
      "Equivale a 2x la primera renta de minutos. Su objetivo es sostener la continuidad del servicio si existe retraso de pago. Al terminar el servicio se devuelve en su totalidad, sujeto al cierre de cuenta.",
  },
  {
    question: "¿Qué pasa si consumo más o menos minutos de los previstos?",
    answer:
      "Si se consume menos, los minutos no se transfieren al mes siguiente. Si se consume más, normalmente se requiere ajustar la bolsa mensual contratada para mantener el servicio sin fricción.",
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="space-y-6">
      <div className="max-w-3xl space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">FAQ</p>
        <h2 className="text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
          Explicaciones rápidas para que el modelo sea fácil de defender internamente.
        </h2>
      </div>

      <div className="rounded-3xl border border-stone-200 bg-white px-6">
        <Accordion type="single" collapsible>
          {FAQS.map((item, index) => (
            <AccordionItem key={item.question} value={`item-${index}`}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
