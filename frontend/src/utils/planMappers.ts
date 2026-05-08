import { BusinessPlan, SavedPlan } from "./storage";

export type PanelRole = "generator" | "critic" | "refiner";

export type PanelAgentConfig = {
  model: string;
  role: PanelRole;
};

export type GeneratePlanPayload = {
  startupIdea: string;
  targetAudience: string;
  industry: string;
  uniqueDifferentiator: string;
  model: string;
  refine?: boolean;
  panel?: {
    agents: PanelAgentConfig[];
  };
};

type CoreConcept = {
  problem?: string;
  solution?: string;
  customer?: string;
  differentiation?: string;
};

type ValueProposition = {
  tagline?: string;
  description?: string;
};

type Persona = {
  name?: string;
  role?: string;
  demographics?: string;
  pain_points?: string[];
  goals?: string[];
  solution_fit?: string;
};

type Competitor = {
  type_or_name?: string;
  strengths?: string[] | string;
  weaknesses?: string[] | string;
  our_advantage?: string;
};

type RevenueStream = {
  name?: string;
  description?: string;
};

type RevenueModel = {
  primary_stream?: RevenueStream;
  secondary_stream?: RevenueStream;
  rationale?: string;
};

type MvpFeatures = {
  must_have?: string[];
  nice_to_have?: string[];
};

type GtmChannel = {
  channel_name?: string;
  target_audience?: string;
  strategy_description?: string;
};

type PitchDeckSlide = {
  slide_number?: number;
  title?: string;
  key_message?: string;
};

export type PanelExchange = {
  role: PanelRole;
  model: string;
  output: string;
};

export type PanelStepTrace = {
  step_name: string;
  exchanges: PanelExchange[];
};

export type GeneratePlanResponse = {
  plan_id: string;
  generated_sections: {
    core_components?: CoreConcept;
    value_proposition?: ValueProposition;
    customer_personas?: {
      personas?: Persona[];
    };
    competitive_analysis?: {
      competitors?: Competitor[];
    };
    revenue_model?: RevenueModel;
    mvp_feature_list?: MvpFeatures;
    go_to_market_strategy?: {
      channels?: GtmChannel[];
    };
  };
  refined_plan: Record<string, unknown>;
  pitch_deck_outline: {
    slides?: PitchDeckSlide[];
  };
  validation_result: {
    complete: boolean;
    missing_sections: string[];
    warnings: string[];
  };
  panel_trace?: PanelStepTrace[];
};

function formatList(items: string[] | string | undefined): string {
  if (Array.isArray(items)) {
    return items.length > 0 ? items.join(", ") : "Not specified";
  }

  return items || "Not specified";
}

function formatRevenueStream(label: string, stream: RevenueStream | undefined): string {
  if (!stream?.name && !stream?.description) {
    return `${label}: Not specified`;
  }

  if (stream.name && stream.description) {
    return `${label}: ${stream.name} - ${stream.description}`;
  }

  return `${label}: ${stream.name ?? stream.description}`;
}

function withFallback(items: string[], fallback: string): string[] {
  return items.length > 0 ? items : [fallback];
}

export function mapGenerateResponseToBusinessPlan(response: GeneratePlanResponse): BusinessPlan {
  const sections = response.generated_sections;
  const valueProposition = [
    sections.value_proposition?.tagline && `Tagline: ${sections.value_proposition.tagline}`,
    sections.value_proposition?.description
  ]
    .filter(Boolean)
    .join("\n\n");

  const customerPersonas = withFallback(
    (sections.customer_personas?.personas ?? []).map((persona, index) => {
      const name = persona.name ?? `Persona ${index + 1}`;
      const role = persona.role ? ` (${persona.role})` : "";

      return [
        `${name}${role}`,
        `Demographics: ${persona.demographics ?? "Not specified"}`,
        `Pain points: ${formatList(persona.pain_points)}`,
        `Goals: ${formatList(persona.goals)}`,
        `Solution fit: ${persona.solution_fit ?? "Not specified"}`
      ].join("\n");
    }),
    "No customer personas were returned."
  );

  const competitiveAnalysis = withFallback(
    (sections.competitive_analysis?.competitors ?? []).map((competitor, index) =>
      [
        competitor.type_or_name ?? `Competitor archetype ${index + 1}`,
        `Strengths: ${formatList(competitor.strengths)}`,
        `Weaknesses: ${formatList(competitor.weaknesses)}`,
        `Our advantage: ${competitor.our_advantage ?? "Not specified"}`
      ].join("\n")
    ),
    "No competitive analysis was returned."
  );

  const revenueModel = [
    formatRevenueStream("Primary", sections.revenue_model?.primary_stream),
    formatRevenueStream("Secondary", sections.revenue_model?.secondary_stream),
    `Rationale: ${sections.revenue_model?.rationale ?? "Not specified"}`
  ].join("\n\n");

  const mvpFeatures = withFallback(
    [
      ...(sections.mvp_feature_list?.must_have ?? []).map((feature) => `Must-have: ${feature}`),
      ...(sections.mvp_feature_list?.nice_to_have ?? []).map((feature) => `Nice-to-have: ${feature}`)
    ],
    "No MVP features were returned."
  );

  const goToMarketStrategy = withFallback(
    (sections.go_to_market_strategy?.channels ?? []).map((channel, index) =>
      [
        `${channel.channel_name ?? `Channel ${index + 1}`}`,
        `Target audience: ${channel.target_audience ?? "Not specified"}`,
        `Strategy: ${channel.strategy_description ?? "Not specified"}`
      ].join("\n")
    ),
    "No go-to-market strategy was returned."
  );

  const pitchDeckOutline = withFallback(
    (response.pitch_deck_outline.slides ?? []).map((slide, index) => {
      const slideNumber = slide.slide_number ?? index + 1;
      return `Slide ${slideNumber}: ${slide.title ?? "Untitled"}\n${slide.key_message ?? "No key message provided."}`;
    }),
    "No pitch deck outline was returned."
  );

  return {
    valueProposition: valueProposition || "No value proposition was returned.",
    customerPersonas,
    competitiveAnalysis,
    revenueModel,
    mvpFeatures,
    goToMarketStrategy,
    pitchDeckOutline
  };
}

type BackendPlan = {
  id?: string;
  _id?: string;
  startup_idea?: string;
  target_audience?: string;
  industry?: string;
  unique_differentiator?: string;
  model?: string;
  created_at?: string;
  updated_at?: string;
  generated_sections?: GeneratePlanResponse["generated_sections"];
  refined_plan?: Record<string, unknown>;
  pitch_deck_outline?: GeneratePlanResponse["pitch_deck_outline"];
  validation_result?: GeneratePlanResponse["validation_result"];
};

export function mapBackendPlanToSavedPlan(rawPlan: unknown): SavedPlan {
  const plan = rawPlan as BackendPlan;
  const startupIdea = plan.startup_idea ?? "";
  const response: GeneratePlanResponse = {
    plan_id: plan.id ?? plan._id ?? "",
    generated_sections: plan.generated_sections ?? {},
    refined_plan: plan.refined_plan ?? {},
    pitch_deck_outline: plan.pitch_deck_outline ?? {},
    validation_result: plan.validation_result ?? {
      complete: true,
      missing_sections: [],
      warnings: []
    }
  };

  return {
    id: response.plan_id,
    title: `${startupIdea.split(" ").slice(0, 4).join(" ") || "Untitled"} Plan`,
    startupIdea,
    targetAudience: plan.target_audience ?? "",
    industry: plan.industry ?? "",
    differentiator: plan.unique_differentiator ?? "",
    model: plan.model,
    plan: mapGenerateResponseToBusinessPlan(response),
    createdAt: plan.created_at ?? new Date().toISOString(),
    updatedAt: plan.updated_at ?? plan.created_at ?? new Date().toISOString()
  };
}
