export type PricingMode = "client" | "reseller";

export type GlobalQuoteInputs = {
  minutes: number;
  includePlatform: boolean;
};

export type AgentQuoteInputs = {
  id: string;
  name: string;
  developmentHours: number;
  concurrency: number;
  includeIntelligentTools: boolean;
  useWhatsApp: boolean;
  marketingMessages: number;
  utilityMessages: number;
  whatsappTemplates: number;
  includeGeolocation: boolean;
  geolocationQueries: number;
  includeCustomTool: boolean;
  customToolName: string;
  customToolMonthly: number;
};

export type AgentBreakdown = {
  id: string;
  name: string;
  developmentHours: number;
  monthlyConcurrency: number;
  monthlyToolsBase: number;
  monthlyWhatsAppMarketing: number;
  monthlyWhatsAppUtility: number;
  monthlyGeolocation: number;
  monthlyCustomTool: number;
  setupWhatsAppTemplates: number;
  monthlySubtotal: number;
  setupDevelopment: number;
  setupSubtotal: number;
};

export type QuoteBreakdown = {
  minuteRate: number;
  monthlyMinutes: number;
  monthlyPlatform: number;
  agents: AgentBreakdown[];
  monthlyAgents: number;
  monthlySubtotal: number;
  setupSubtotal: number;
  guaranteeDeposit: number;
  totalStartup: number;
};

export type PricingRates = {
  minuteRate: number;
  developmentHourlyRate: number;
  concurrency: number;
  intelligentTool: number;
  platform: number;
  whatsappMarketing: number;
  whatsappUtility: number;
  whatsappTemplate: number;
  geolocation: number;
};

export type PricingConfig = {
  client: PricingRates;
  reseller: PricingRates;
};

const RESELLER_MULTIPLIER = 0.84;

function roundRate(value: number, decimals = 4) {
  return Number(value.toFixed(decimals));
}

export const DEFAULT_GLOBAL_INPUTS: GlobalQuoteInputs = {
  minutes: 5000,
  includePlatform: true,
};

export const DEFAULT_AGENT_INPUTS: AgentQuoteInputs = {
  id: "agent-1",
  name: "Agente 1",
  developmentHours: 100,
  concurrency: 2,
  includeIntelligentTools: true,
  useWhatsApp: false,
  marketingMessages: 0,
  utilityMessages: 0,
  whatsappTemplates: 0,
  includeGeolocation: false,
  geolocationQueries: 0,
  includeCustomTool: false,
  customToolName: "Herramienta personalizada",
  customToolMonthly: 0,
};

export const PRICING: PricingConfig = {
  client: {
    minuteRate: 0.25,
    developmentHourlyRate: 28,
    concurrency: 30,
    intelligentTool: 8,
    platform: 250,
    whatsappMarketing: 0.1,
    whatsappUtility: 0.03,
    whatsappTemplate: 12,
    geolocation: 0.008,
  },
  reseller: {
    minuteRate: 0.21,
    developmentHourlyRate: roundRate(28 * RESELLER_MULTIPLIER, 2),
    concurrency: roundRate(30 * RESELLER_MULTIPLIER, 2),
    intelligentTool: roundRate(8 * RESELLER_MULTIPLIER, 2),
    platform: roundRate(250 * RESELLER_MULTIPLIER, 2),
    whatsappMarketing: roundRate(0.1 * RESELLER_MULTIPLIER, 4),
    whatsappUtility: roundRate(0.03 * RESELLER_MULTIPLIER, 4),
    whatsappTemplate: roundRate(12 * RESELLER_MULTIPLIER, 2),
    geolocation: roundRate(0.008 * RESELLER_MULTIPLIER, 4),
  },
} as const;

export const PRICE_LIST_ITEMS = [
  { key: "minuteRate", label: "Minuto mensual", description: "Tarifa por minuto consumido" },
  { key: "platform", label: "Plataforma Conbiz mensual", description: "Renta global de monitoreo y gestión" },
  { key: "concurrency", label: "Concurrencia mensual", description: "Costo por concurrencia activa" },
  {
    key: "intelligentTool",
    label: "Herramienta inteligente por concurrencia",
    description: "Cargo base por herramienta activa y concurrencia",
  },
  {
    key: "developmentHourlyRate",
    label: "Precio por hora desarrollador",
    description: "Tarifa horaria que multiplica las horas de desarrollo del agente",
  },
  { key: "whatsappMarketing", label: "WhatsApp marketing", description: "Costo por mensaje marketing" },
  { key: "whatsappUtility", label: "WhatsApp utilitarios", description: "Costo por mensaje utilitario" },
  { key: "whatsappTemplate", label: "Plantilla WhatsApp", description: "Costo por alta de plantilla" },
  { key: "geolocation", label: "Geolocalización", description: "Costo por consulta" },
] as const;

function toFiniteNumber(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function isLegacyMirroredReseller(source: Partial<PricingRates> | undefined) {
  if (!source) return false;

  return (
    source.minuteRate === 0.21 &&
    source.developmentHourlyRate === 28 &&
    source.concurrency === 30 &&
    source.intelligentTool === 8 &&
    source.platform === 250 &&
    source.whatsappMarketing === 0.1 &&
    source.whatsappUtility === 0.03 &&
    source.whatsappTemplate === 12 &&
    source.geolocation === 0.008
  );
}

export function normalizePricingConfig(input: unknown): PricingConfig {
  const candidate = (input ?? {}) as Partial<PricingConfig> & {
    shared?: { developmentBasePrice?: number; developmentBaseHours?: number };
  };

  const normalizeRates = (
    mode: PricingMode,
    source: Partial<PricingRates> | undefined,
  ): PricingRates => {
    const defaults = PRICING[mode];
    const legacyBasePrice = candidate.shared?.developmentBasePrice;
    const legacyBaseHours = candidate.shared?.developmentBaseHours;
    const derivedLegacyHourlyRate =
      typeof legacyBasePrice === "number" &&
      Number.isFinite(legacyBasePrice) &&
      typeof legacyBaseHours === "number" &&
      Number.isFinite(legacyBaseHours) &&
      legacyBaseHours > 0
        ? legacyBasePrice / legacyBaseHours
        : defaults.developmentHourlyRate;

    return {
      minuteRate: toFiniteNumber(source?.minuteRate, defaults.minuteRate),
      developmentHourlyRate: toFiniteNumber(source?.developmentHourlyRate, derivedLegacyHourlyRate),
      concurrency: toFiniteNumber(source?.concurrency, defaults.concurrency),
      intelligentTool: toFiniteNumber(source?.intelligentTool, defaults.intelligentTool),
      platform: toFiniteNumber(source?.platform, defaults.platform),
      whatsappMarketing: toFiniteNumber(source?.whatsappMarketing, defaults.whatsappMarketing),
      whatsappUtility: toFiniteNumber(source?.whatsappUtility, defaults.whatsappUtility),
      whatsappTemplate: toFiniteNumber(source?.whatsappTemplate, defaults.whatsappTemplate),
      geolocation: toFiniteNumber(source?.geolocation, defaults.geolocation),
    };
  };

  return {
    client: normalizeRates("client", candidate.client),
    reseller: normalizeRates("reseller", isLegacyMirroredReseller(candidate.reseller) ? undefined : candidate.reseller),
  };
}

export function createAgent(index: number): AgentQuoteInputs {
  return {
    ...DEFAULT_AGENT_INPUTS,
    id: `agent-${index + 1}`,
    name: `Agente ${index + 1}`,
  };
}

export function getPricingRates(config: PricingConfig, mode: PricingMode) {
  return config[mode];
}

export function calculateQuote(
  mode: PricingMode,
  globalInputs: GlobalQuoteInputs,
  agents: AgentQuoteInputs[],
  pricing: PricingConfig = PRICING,
): QuoteBreakdown {
  const rates = getPricingRates(pricing, mode);
  const minuteRate = rates.minuteRate;
  const monthlyMinutes = Math.max(globalInputs.minutes, 0) * minuteRate;
  const monthlyPlatform = globalInputs.includePlatform ? rates.platform : 0;

  const agentBreakdowns = agents.map((agent) => {
    const developmentHours = Math.max(agent.developmentHours, 0);
    const concurrency = Math.max(agent.concurrency, 0);
    const marketingMessages = Math.max(agent.marketingMessages, 0);
    const utilityMessages = Math.max(agent.utilityMessages, 0);
    const whatsappTemplates = Math.max(agent.whatsappTemplates, 0);
    const geolocationQueries = Math.max(agent.geolocationQueries, 0);
    const customToolMonthly = Math.max(agent.customToolMonthly, 0);

    const activeIntelligentTools =
      Number(agent.useWhatsApp) + Number(agent.includeGeolocation) + Number(agent.includeCustomTool);
    const monthlyConcurrency = concurrency * rates.concurrency;
    const monthlyToolsBase = activeIntelligentTools * concurrency * rates.intelligentTool;
    const monthlyWhatsAppMarketing = agent.useWhatsApp ? marketingMessages * rates.whatsappMarketing : 0;
    const monthlyWhatsAppUtility = agent.useWhatsApp ? utilityMessages * rates.whatsappUtility : 0;
    const monthlyGeolocation = agent.includeGeolocation ? geolocationQueries * rates.geolocation : 0;
    const monthlyCustomTool = agent.includeCustomTool ? customToolMonthly : 0;
    const monthlySubtotal =
      monthlyConcurrency +
      monthlyToolsBase +
      monthlyWhatsAppMarketing +
      monthlyWhatsAppUtility +
      monthlyGeolocation +
      monthlyCustomTool;
    const setupDevelopment = developmentHours * rates.developmentHourlyRate;
    const setupWhatsAppTemplates = agent.useWhatsApp ? whatsappTemplates * rates.whatsappTemplate : 0;
    const setupSubtotal = setupDevelopment + setupWhatsAppTemplates;

    return {
      id: agent.id,
      name: agent.name,
      developmentHours,
      monthlyConcurrency,
      monthlyToolsBase,
      monthlyWhatsAppMarketing,
      monthlyWhatsAppUtility,
      monthlyGeolocation,
      monthlyCustomTool,
      setupWhatsAppTemplates,
      monthlySubtotal,
      setupDevelopment,
      setupSubtotal,
    };
  });

  const monthlyAgents = agentBreakdowns.reduce((sum, agent) => sum + agent.monthlySubtotal, 0);
  const setupSubtotal = agentBreakdowns.reduce((sum, agent) => sum + agent.setupSubtotal, 0);
  const guaranteeDeposit = monthlyMinutes * 2;
  const monthlySubtotal = monthlyMinutes + monthlyPlatform + monthlyAgents;
  const totalStartup = setupSubtotal + guaranteeDeposit;

  return {
    minuteRate,
    monthlyMinutes,
    monthlyPlatform,
    agents: agentBreakdowns,
    monthlyAgents,
    monthlySubtotal,
    setupSubtotal,
    guaranteeDeposit,
    totalStartup,
  };
}

export function buildQuoteMessage(
  mode: PricingMode,
  globalInputs: GlobalQuoteInputs,
  agents: AgentQuoteInputs[],
  breakdown: QuoteBreakdown,
) {
  const modeLabel = mode === "client" ? "Cliente final" : "Reseller";
  const agentsSummary = agents
    .map((agent, index) => {
      return `Agente ${index + 1}: ${agent.name} | Concurrencia ${agent.concurrency} | Desarrollo ${agent.developmentHours}h`;
    })
    .join("\n");

  return [
    "Resumen de cotizacion Conbiz",
    `Esquema: ${modeLabel}`,
    `Minutos globales: ${globalInputs.minutes}`,
    `Plataforma global: ${globalInputs.includePlatform ? "Si" : "No"}`,
    `Agentes: ${agents.length}`,
    agentsSummary,
    `Setup estimado: $${breakdown.setupSubtotal.toFixed(2)} USD`,
    `Mensual estimado: $${breakdown.monthlySubtotal.toFixed(2)} USD`,
    `Deposito de garantia: $${breakdown.guaranteeDeposit.toFixed(2)} USD`,
    `Total de arranque: $${breakdown.totalStartup.toFixed(2)} USD`,
  ].join("\n");
}
