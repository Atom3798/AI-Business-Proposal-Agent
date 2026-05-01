import { FormEvent, useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import { PlanHistory } from "../components/PlanHistory";
import { PlanViewer } from "../components/PlanViewer";
import { BusinessGeneratorForm } from "../components/business-generator/BusinessGeneratorForm";
import { LoadingState } from "../components/business-generator/LoadingState";
import {
  SavedPlan,
  generatePlanTitle,
  getSavedPlans,
  savePlan
} from "../utils/storage";
import { generateBusinessPlan } from "../utils/api";
import { mapGenerateResponseToBusinessPlan } from "../utils/planMappers";

type FormValues = {
  startupIdea: string;
  targetAudience: string;
  industry: string;
  differentiator: string;
};

const initialFormValues: FormValues = {
  startupIdea: "",
  targetAudience: "",
  industry: "",
  differentiator: ""
};

function createPlanId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `plan-${Date.now()}`;
}

export default function BusinessGeneratorPage() {
  const [formValues, setFormValues] = useState<FormValues>(initialFormValues);
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>(() => getSavedPlans());
  const [activePlan, setActivePlan] = useState<SavedPlan | null>(() => {
    const plans = getSavedPlans();
    return plans[0] ?? null;
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!activePlan && savedPlans.length > 0) {
      setActivePlan(savedPlans[0]);
    }
  }, [activePlan, savedPlans]);

  const handleChange = (field: keyof FormValues, value: string) => {
    setFormValues((current) => ({
      ...current,
      [field]: value
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formValues.startupIdea.trim()) {
      return;
    }

    setErrorMessage("");
    setIsGenerating(true);

    try {
      const response = await generateBusinessPlan({
        startupIdea: formValues.startupIdea.trim(),
        targetAudience: formValues.targetAudience.trim(),
        industry: formValues.industry.trim(),
        uniqueDifferentiator: formValues.differentiator.trim()
      });

      const mappedPlan = mapGenerateResponseToBusinessPlan(response);
      const timestamp = new Date().toISOString();

      const nextPlan: SavedPlan = {
        id: createPlanId(),
        title: generatePlanTitle(formValues.startupIdea.trim()),
        startupIdea: formValues.startupIdea.trim(),
        targetAudience: formValues.targetAudience.trim(),
        industry: formValues.industry.trim(),
        differentiator: formValues.differentiator.trim(),
        plan: mappedPlan,
        createdAt: timestamp,
        updatedAt: timestamp
      };

      savePlan(nextPlan);

      setSavedPlans((current) => [nextPlan, ...current.filter((plan) => plan.id !== nextPlan.id)]);
      setActivePlan(nextPlan);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong while generating the plan."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="shell-page">
      <Navbar />

      <section className="page-hero">
        <div className="mb-10 max-w-3xl">
          <span className="eyebrow">Live Generator</span>
          <h1 className="section-title mt-4">Build a business plan from a startup idea</h1>
          <p className="section-copy mt-5">
            Turn a rough startup concept into a structured business plan with positioning,
            customer personas, monetization, product scope, and launch strategy.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <BusinessGeneratorForm
              formValues={formValues}
              isGenerating={isGenerating}
              onChange={handleChange}
              onSubmit={handleSubmit}
            />

            {isGenerating && <LoadingState />}

            {errorMessage && (
              <div className="rounded-[1.5rem] border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-100">
                {errorMessage}
              </div>
            )}
          </div>

          <aside className="panel p-6">
            <p className="text-xs uppercase tracking-[0.28em] text-accent">What You Get</p>
            <h2 className="mt-3 text-2xl font-semibold text-foreground">A clearer plan, faster</h2>
            <div className="mt-5 space-y-4 text-sm leading-7 text-muted-foreground">
              <p>
                Start with a simple idea and get a polished draft you can review, refine, and share.
              </p>
              <p>
                Each plan is organized into practical sections so you can move from concept to
                decision-making without rebuilding the story from scratch.
              </p>
              <p>
                Save past drafts, revisit earlier directions, and export the results when you are
                ready to present or iterate.
              </p>
            </div>
          </aside>
        </div>
      </section>

      {activePlan ? (
        <PlanViewer
          title={activePlan.title}
          idea={activePlan.startupIdea}
          audience={activePlan.targetAudience}
          industry={activePlan.industry}
          differentiator={activePlan.differentiator}
          plan={activePlan.plan}
        />
      ) : (
        <section className="mx-auto max-w-6xl px-6 pb-8">
          <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-8 text-slate-300 shadow-premium backdrop-blur-xl">
            Generated plans will appear here after the first successful request.
          </div>
        </section>
      )}

      <PlanHistory plans={savedPlans} onViewPlan={setActivePlan} />
    </div>
  );
}



