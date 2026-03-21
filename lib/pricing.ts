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

export type PricingConfig = {
  minuteRate: {
    client: number;
    reseller: number;
  };
  developmentBasePrice: number;
  developmentBaseHours: number;
  concurrency: number;
  intelligentTool: number;
  platform: number;
  whatsappMarketing: number;
  whatsappUtility: number;
  whatsappTemplate: number;
  geolocation: number;
};

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

export function createAgent(index: number): AgentQuoteInputs {
  return {
    ...DEFAULT_AGENT_INPUTS,
    id: `agent-${index + 1}`,
    name: `Agente ${index + 1}`,
  };
}

export function calculateQuote(
  mode: PricingMode,
  globalInputs: GlobalQuoteInputs,
  agents: AgentQuoteInputs[],
  pricing: PricingConfig = PRICING,
): QuoteBreakdown {
  const minuteRate = pricing.minuteRate[mode];
  const monthlyMinutes = Math.max(globalInputs.minutes, 0) * minuteRate;
  const monthlyPlatform = globalInputs.includePlatform ? pricing.platform : 0;
  const hourlyRate = pricing.developmentBasePrice / pricing.developmentBaseHours;

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
    const monthlyConcurrency = concurrency * pricing.concurrency;
    const monthlyToolsBase = activeIntelligentTools * concurrency * pricing.intelligentTool;
    const monthlyWhatsAppMarketing = agent.useWhatsApp ? marketingMessages * pricing.whatsappMarketing : 0;
    const monthlyWhatsAppUtility = agent.useWhatsApp ? utilityMessages * pricing.whatsappUtility : 0;
    const monthlyGeolocation = agent.includeGeolocation ? geolocationQueries * pricing.geolocation : 0;
    const monthlyCustomTool = agent.includeCustomTool ? customToolMonthly : 0;
    const monthlySubtotal =
      monthlyConcurrency +
      monthlyToolsBase +
      monthlyWhatsAppMarketing +
      monthlyWhatsAppUtility +
      monthlyGeolocation +
      monthlyCustomTool;
    const setupDevelopment = developmentHours * hourlyRate;
    const setupWhatsAppTemplates = agent.useWhatsApp ? whatsappTemplates * pricing.whatsappTemplate : 0;
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
