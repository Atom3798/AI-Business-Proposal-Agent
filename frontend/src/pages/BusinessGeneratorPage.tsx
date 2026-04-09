import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Download, Sparkles, WandSparkles, ArrowRight, ChevronRight, Compass, LineChart, Rocket } from "lucide-react";
import { BusinessGeneratorForm } from "../components/business-generator/BusinessGeneratorForm";
import { LoadingState } from "../components/business-generator/LoadingState";
import { OutputSectionCard } from "../components/business-generator/OutputSectionCard";

type FormValues = {
  startupIdea: string;
  targetAudience: string;
  industry: string;
  differentiator: string;
};

type BusinessPlan = {
  valueProposition: string;
  customerPersonas: string[];
  competitiveAnalysis: string[];
  revenueModel: string;
  mvpFeatures: string[];
  goToMarketStrategy: string[];
  pitchDeckOutline: string[];
};

const initialFormValues: FormValues = {
  startupIdea: "",
  targetAudience: "",
  industry: "",
  differentiator: ""
};

function buildMockPlan({
  startupIdea,
  targetAudience,
  industry,
  differentiator
}: FormValues): BusinessPlan {
  const audience = targetAudience || "digital-first professionals looking for a faster way to solve the problem";
  const market = industry || "high-growth software";
  const edge = differentiator || "a sharper AI workflow and a more opinionated customer experience";

  return {
    valueProposition: `${startupIdea} helps ${audience} solve a painful workflow gap in the ${market} space by combining fast AI-generated guidance with structured execution. The product stands out through ${edge}, making it easier to move from idea to outcome without enterprise-level complexity.`,
    customerPersonas: [
      `Primary persona: operators and founders in ${market} who need a faster, lower-risk way to validate opportunities and act on them.`,
      `Secondary persona: team leads serving ${audience}, looking for a repeatable process they can roll out without long onboarding cycles.`
    ],
    competitiveAnalysis: [
      `Direct competitors often provide fragmented tooling or generic templates, which leaves users stitching strategy together manually.`,
      `The opportunity for ${startupIdea} is to win on speed, clarity, and execution support while positioning ${edge} as the reason users switch and stay.`
    ],
    revenueModel: `Start with a subscription model offering a free exploratory tier, a paid pro plan for deeper generation and exports, and a team plan for collaboration. Layer in premium services like onboarding, bespoke strategy sessions, or template packs once activation patterns are clear.`,
    mvpFeatures: [
      "Guided startup brief intake with clear prompts and smart defaults.",
      "AI-generated business plan sections with editable cards and copy-ready formatting.",
      "Export actions for PDF, sharing, and pitch-ready summaries.",
      "Saved history so founders can iterate on different concepts over time."
    ],
    goToMarketStrategy: [
      `Launch with targeted content for ${audience}, including niche landing pages, examples, and founder-focused social clips.`,
      "Pair product-led acquisition with partnerships in communities, accelerators, and newsletters that already aggregate startup builders.",
      "Use early user interviews and generated-plan analytics to sharpen messaging and improve conversion from visitor to first output."
    ],
    pitchDeckOutline: [
      `Problem: show the pain point behind ${startupIdea}.`,
      `Solution: demonstrate how the product delivers ${edge}.`,
      `Market: quantify the opportunity in ${market}.`,
      "Business model: explain subscription, expansion, and retention levers.",
      "Product roadmap: outline MVP now and expansion next.",
      "Traction thesis: share adoption signals, experiments, and learning loops.",
      "Team and ask: close with why this team can win and what support is needed."
    ]
  };
}

const sectionOrder: Array<{ key: keyof BusinessPlan; title: string }> = [
  { key: "valueProposition", title: "Value Proposition" },
  { key: "customerPersonas", title: "Customer Personas" },
  { key: "competitiveAnalysis", title: "Competitive Analysis" },
  { key: "revenueModel", title: "Revenue Model" },
  { key: "mvpFeatures", title: "MVP Features" },
  { key: "goToMarketStrategy", title: "Go-To-Market Strategy" },
  { key: "pitchDeckOutline", title: "Pitch Deck Outline" }
];

export function BusinessGeneratorPage() {
  const [formValues, setFormValues] = useState<FormValues>(initialFormValues);
  const [isGenerating, setIsGenerating] = useState(false);
  const [plan, setPlan] = useState<BusinessPlan | null>(null);
  const resultsRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    document.title = "AI Business Generator";

    if (plan && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [plan]);

  const handleChange = (field: keyof FormValues, value: string) => {
    setFormValues((current) => ({
      ...current,
      [field]: value
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formValues.startupIdea.trim()) {
      return;
    }

    setIsGenerating(true);
    setPlan(null);

    window.setTimeout(() => {
      setPlan(buildMockPlan(formValues));
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen overflow-hidden bg-mesh-dark text-white">
      <div className="relative mx-auto max-w-7xl px-6 py-10 sm:py-14">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[28rem] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_45%)]" />

        <header className="mx-auto mb-8 max-w-5xl">
          <div className="flex flex-col gap-5 rounded-[2rem] border border-white/10 bg-slate-950/45 px-6 py-5 shadow-premium backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 via-amber-300 to-emerald-300 text-slate-950 shadow-lg shadow-orange-500/20">
                <Sparkles size={20} />
              </div>
              <div>
                <p className="font-heading text-xl font-semibold tracking-tight text-white">AI Business Generator</p>
                <p className="text-sm text-slate-400">From raw idea to roadmap, revenue model, and pitch structure.</p>
              </div>
            </div>

            <nav className="flex flex-wrap gap-2 text-sm text-slate-200">
              <a href="#generator" className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 transition hover:border-orange-300/30 hover:bg-white/[0.08]">
                Generator
              </a>
              <a href="#results" className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 transition hover:border-orange-300/30 hover:bg-white/[0.08]">
                Results
              </a>
              <a href="#footer" className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 transition hover:border-orange-300/30 hover:bg-white/[0.08]">
                About
              </a>
            </nav>
          </div>
        </header>

        <motion.section
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-5xl"
        >
          <div className="rounded-[2.5rem] border border-white/10 bg-slate-950/55 p-8 shadow-premium backdrop-blur-xl sm:p-12">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-300/20 bg-orange-300/10 px-4 py-2 text-sm text-orange-100">
              <Sparkles size={16} />
              Idea to investor-ready blueprint
            </div>

            <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
              <div>
                <h1 className="font-heading text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl">
                  AI Business Generator
                </h1>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
                  Turn your startup idea into a full business plan instantly.
                </p>
                <div className="mt-8 flex flex-wrap gap-3 text-sm">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-slate-200">
                    <Compass size={16} className="text-orange-300" />
                    Strategic positioning
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-slate-200">
                    <LineChart size={16} className="text-emerald-300" />
                    Revenue thinking
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-slate-200">
                    <Rocket size={16} className="text-amber-200" />
                    Launch-ready outputs
                  </div>
                </div>
              </div>

              <div className="grid gap-4 rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 text-sm text-slate-300">
                <div className="flex items-center gap-3">
                  <WandSparkles className="text-orange-300" size={18} />
                  Structured plan sections
                </div>
                <div className="flex items-center gap-3">
                  <WandSparkles className="text-emerald-300" size={18} />
                  Mock AI generation flow
                </div>
                <div className="flex items-center gap-3">
                  <WandSparkles className="text-amber-200" size={18} />
                  Responsive founder-friendly UI
                </div>
              </div>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {[
                {
                  label: "Sharper business story",
                  text: "Translate rough founder thinking into a structured narrative investors and operators can scan fast."
                },
                {
                  label: "Built for iteration",
                  text: "Experiment with audiences, markets, and differentiators without rewriting your plan from scratch."
                },
                {
                  label: "Presentation friendly",
                  text: "Every section is organized to support strategy docs, founder memos, and future pitch decks."
                }
              ].map((item) => (
                <div key={item.label} className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-200/80">{item.label}</p>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        <section id="generator" className="mx-auto mt-8 max-w-5xl">
          <BusinessGeneratorForm
            formValues={formValues}
            isGenerating={isGenerating}
            onChange={handleChange}
            onSubmit={handleSubmit}
          />
        </section>

        {isGenerating ? (
          <section className="mx-auto mt-8 max-w-5xl">
            <LoadingState />
          </section>
        ) : null}

        {plan ? (
          <motion.section
            id="results"
            ref={resultsRef}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto mt-10 max-w-5xl"
          >
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-orange-200/80">Generated Output</p>
                <h2 className="mt-2 font-heading text-3xl font-semibold text-white sm:text-4xl">
                  Your AI-crafted business plan
                </h2>
              </div>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-medium text-slate-100 transition hover:border-orange-300/30 hover:bg-white/[0.08]"
              >
                <Download size={16} />
                Download as PDF
              </button>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {sectionOrder.map(({ key, title }, index) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  className={key === "pitchDeckOutline" ? "md:col-span-2" : ""}
                >
                  <OutputSectionCard title={title} content={plan[key]} />
                </motion.div>
              ))}
            </div>
          </motion.section>
        ) : null}

        <footer id="footer" className="mx-auto mt-14 max-w-5xl">
          <div className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-950/55 shadow-premium backdrop-blur-xl">
            <div className="grid gap-8 px-8 py-10 md:grid-cols-[1.2fr_0.8fr] md:px-10">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-orange-200/80">Launch Better</p>
                <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Turn sparks of insight into a business people can believe in
                </h2>
                <p className="mt-4 max-w-2xl text-slate-300">
                  AI Business Generator helps founders move from vague concept to clear plan with stronger positioning, monetization, and go-to-market thinking.
                </p>
                <a
                  href="#generator"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-300 px-5 py-3 font-semibold text-slate-950 transition hover:scale-[1.01]"
                >
                  Start crafting your plan
                  <ArrowRight size={16} />
                </a>
              </div>

              <div className="grid gap-4">
                {[
                  "Value proposition and customer framing",
                  "Revenue model and MVP thinking",
                  "Go-to-market and pitch deck structure"
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 text-slate-200">
                    <ChevronRight size={18} className="mt-1 shrink-0 text-orange-300" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-white/10 px-8 py-5 text-sm text-slate-400 md:px-10">
              AI Business Generator. Built to help ambitious ideas look clearer, stronger, and more launch-ready.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
