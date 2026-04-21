import { BusinessPlan } from "./storage";

export type GeneratePlanPayload = {
  startupIdea: string;
  targetAudience: string;
  industry: string;
  uniqueDifferentiator: string;
  refine?: boolean;
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
  strengths?: string[];
  weaknesses?: string[];
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

export type GeneratePlanResponse = {
  core_concept: CoreConcept;
  value_proposition: ValueProposition;
  customer_personas: {
    personas?: Persona[];
  };
  competitive_analysis: {
    competitors?: Competitor[];
  };
  revenue_model: RevenueModel;
  mvp_features: MvpFeatures;
  gtm_strategy: {
    channels?: GtmChannel[];
  };
  pitch_deck: {
    slides?: PitchDeckSlide[];
  };
};

function formatList(items: string[] | undefined): string {
  return items && items.length > 0 ? items.join(", ") : "Not specified";
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
  const valueProposition = [
    response.value_proposition.tagline && `Tagline: ${response.value_proposition.tagline}`,
    response.value_proposition.description
  ]
    .filter(Boolean)
    .join("\n\n");

  const customerPersonas = withFallback(
    (response.customer_personas.personas ?? []).map((persona, index) => {
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
    (response.competitive_analysis.competitors ?? []).map((competitor, index) =>
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
    formatRevenueStream("Primary", response.revenue_model.primary_stream),
    formatRevenueStream("Secondary", response.revenue_model.secondary_stream),
    `Rationale: ${response.revenue_model.rationale ?? "Not specified"}`
  ].join("\n\n");

  const mvpFeatures = withFallback(
    [
      ...(response.mvp_features.must_have ?? []).map((feature) => `Must-have: ${feature}`),
      ...(response.mvp_features.nice_to_have ?? []).map((feature) => `Nice-to-have: ${feature}`)
    ],
    "No MVP features were returned."
  );

  const goToMarketStrategy = withFallback(
    (response.gtm_strategy.channels ?? []).map((channel, index) =>
      [
        `${channel.channel_name ?? `Channel ${index + 1}`}`,
        `Target audience: ${channel.target_audience ?? "Not specified"}`,
        `Strategy: ${channel.strategy_description ?? "Not specified"}`
      ].join("\n")
    ),
    "No go-to-market strategy was returned."
  );

  const pitchDeckOutline = withFallback(
    (response.pitch_deck.slides ?? []).map((slide, index) => {
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
