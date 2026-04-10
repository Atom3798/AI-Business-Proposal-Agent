// LocalStorage management for saved business plans

export type SavedPlan = {
  id: string;
  title: string;
  startupIdea: string;
  targetAudience: string;
  industry: string;
  differentiator: string;
  plan: BusinessPlan;
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

const STORAGE_KEY = "ai_business_plans";

export function getSavedPlans(): SavedPlan[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to load plans from storage", error);
    return [];
  }
}

export function savePlan(plan: SavedPlan): void {
  try {
    const plans = getSavedPlans();
    const existingIndex = plans.findIndex((p) => p.id === plan.id);

    if (existingIndex >= 0) {
      plans[existingIndex] = plan;
    } else {
      plans.unshift(plan);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
  } catch (error) {
    console.error("Failed to save plan to storage", error);
  }
}

export function deletePlan(id: string): void {
  try {
    const plans = getSavedPlans();
    const filtered = plans.filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Failed to delete plan from storage", error);
  }
}

export function getPlanById(id: string): SavedPlan | null {
  const plans = getSavedPlans();
  return plans.find((p) => p.id === id) || null;
}

export function generatePlanTitle(idea: string): string {
  const words = idea.split(" ").slice(0, 4).join(" ");
  return `${words || "Untitled"} Plan`;
}
