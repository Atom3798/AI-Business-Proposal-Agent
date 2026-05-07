export type SavedPlan = {
  id: string;
  title: string;
  startupIdea: string;
  targetAudience: string;
  industry: string;
  differentiator: string;
  model?: string;
  plan: BusinessPlan;
  warnings?: string[];
  createdAt: string;
  updatedAt: string;
};

export type BusinessPlan = {
  valueProposition: string;
  customerPersonas: string[];
  competitiveAnalysis: string[];
  revenueModel: string;
  mvpFeatures: string[];
  goToMarketStrategy: string[];
  pitchDeckOutline: string[];
};

export function generatePlanTitle(idea: string): string {
  const words = idea.split(" ").slice(0, 4).join(" ");
  return `${words || "Untitled"} Plan`;
}
