export type PricingMode = "client" | "reseller";

export type QuoteInputs = {
  minutes: number;
  concurrency: number;
  developmentHours: number;
  includePlatform: boolean;
  includeIntelligentTools: boolean;
  useWhatsApp: boolean;
  marketingMessages: number;
  utilityMessages: number;
  whatsappTemplates: number;
  geolocationQueries: number;
};

export type QuoteBreakdown = {
  minuteRate: number;
  monthlyMinutes: number;
  monthlyConcurrency: number;
  monthlyToolsBase: number;
  monthlyPlatform: number;
  monthlyWhatsAppMarketing: number;
  monthlyWhatsAppUtility: number;
  monthlyGeolocation: number;
  setupDevelopment: number;
  setupWhatsAppTemplates: number;
  monthlySubtotal: number;
  setupSubtotal: number;
  guaranteeDeposit: number;
  totalStartup: number;
};

export const DEFAULT_QUOTE_INPUTS: QuoteInputs = {
  minutes: 5000,
  concurrency: 4,
  developmentHours: 100,
  includePlatform: true,
  includeIntelligentTools: true,
  useWhatsApp: false,
  marketingMessages: 0,
  utilityMessages: 0,
  whatsappTemplates: 0,
  geolocationQueries: 0,
};

export const PRICING = {
  minuteRate: {
    client: 0.25,
    reseller: 0.21,
  },
  developmentBasePrice: 2800,
  developmentBaseHours: 100,
  concurrency: 30,
  intelligentTool: 8,
  platform: 250,
  whatsappMarketing: 0.1,
  whatsappUtility: 0.03,
  whatsappTemplate: 12,
  geolocation: 0.008,
} as const;

export function calculateQuote(mode: PricingMode, inputs: QuoteInputs): QuoteBreakdown {
  const safeInputs = {
    minutes: Math.max(inputs.minutes, 0),
    concurrency: Math.max(inputs.concurrency, 0),
    developmentHours: Math.max(inputs.developmentHours, 0),
    marketingMessages: Math.max(inputs.marketingMessages, 0),
    utilityMessages: Math.max(inputs.utilityMessages, 0),
    whatsappTemplates: Math.max(inputs.whatsappTemplates, 0),
    geolocationQueries: Math.max(inputs.geolocationQueries, 0),
  };

  const minuteRate = PRICING.minuteRate[mode];
  const monthlyMinutes = safeInputs.minutes * minuteRate;
  const monthlyConcurrency = safeInputs.concurrency * PRICING.concurrency;
  const monthlyToolsBase = inputs.includeIntelligentTools
    ? safeInputs.concurrency * PRICING.intelligentTool
    : 0;
  const monthlyPlatform = inputs.includePlatform ? PRICING.platform : 0;
  const monthlyWhatsAppMarketing = inputs.useWhatsApp
    ? safeInputs.marketingMessages * PRICING.whatsappMarketing
    : 0;
  const monthlyWhatsAppUtility = inputs.useWhatsApp
    ? safeInputs.utilityMessages * PRICING.whatsappUtility
    : 0;
  const monthlyGeolocation = safeInputs.geolocationQueries * PRICING.geolocation;

  const hourlyRate = PRICING.developmentBasePrice / PRICING.developmentBaseHours;
  const setupDevelopment = safeInputs.developmentHours * hourlyRate;
  const setupWhatsAppTemplates = inputs.useWhatsApp
    ? safeInputs.whatsappTemplates * PRICING.whatsappTemplate
    : 0;

  const monthlySubtotal =
    monthlyMinutes +
    monthlyConcurrency +
    monthlyToolsBase +
    monthlyPlatform +
    monthlyWhatsAppMarketing +
    monthlyWhatsAppUtility +
    monthlyGeolocation;

  const setupSubtotal = setupDevelopment + setupWhatsAppTemplates;
  const guaranteeDeposit = monthlyMinutes * 2;
  const totalStartup = setupSubtotal + monthlySubtotal + guaranteeDeposit;

  return {
    minuteRate,
    monthlyMinutes,
    monthlyConcurrency,
    monthlyToolsBase,
    monthlyPlatform,
    monthlyWhatsAppMarketing,
    monthlyWhatsAppUtility,
    monthlyGeolocation,
    setupDevelopment,
    setupWhatsAppTemplates,
    monthlySubtotal,
    setupSubtotal,
    guaranteeDeposit,
    totalStartup,
  };
}

export function buildWhatsAppMessage(mode: PricingMode, inputs: QuoteInputs, breakdown: QuoteBreakdown) {
  const modeLabel = mode === "client" ? "Cliente final" : "Reseller";

  return [
    "Hola, me interesa una cotizacion de Conbiz.",
    `Esquema: ${modeLabel}`,
    `Minutos estimados: ${inputs.minutes}`,
    `Concurrencia: ${inputs.concurrency}`,
    `Horas de desarrollo: ${inputs.developmentHours}`,
    `Costo setup estimado: $${breakdown.setupSubtotal.toFixed(2)} USD`,
    `Costo mensual estimado: $${breakdown.monthlySubtotal.toFixed(2)} USD`,
    `Deposito de garantia: $${breakdown.guaranteeDeposit.toFixed(2)} USD`,
    `Total de arranque: $${breakdown.totalStartup.toFixed(2)} USD`,
  ].join("\n");
}
