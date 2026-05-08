import { useState } from "react";
import { PanelAgentConfig, PanelRole } from "../../utils/planMappers";

const HF_MODELS = [
  { id: "meta-llama/Llama-3.3-70B-Instruct-Turbo", label: "Llama 3.3 70B" },
  { id: "deepseek-ai/DeepSeek-V3", label: "DeepSeek V3" },
  { id: "deepseek-ai/DeepSeek-V3-0324", label: "DeepSeek V3.2" },
  { id: "deepseek-ai/DeepSeek-R1", label: "DeepSeek R1" },
  { id: "moonshotai/Kimi-K2.5", label: "Kimi K2.5" },
  { id: "Qwen/Qwen2.5-7B-Instruct-Turbo", label: "Qwen 2.5 7B" },
];

const PANEL_DEFAULTS: PanelAgentConfig[] = [
  { model: "meta-llama/Llama-3.3-70B-Instruct-Turbo", role: "generator" },
  { model: "deepseek-ai/DeepSeek-V3", role: "critic" },
  { model: "deepseek-ai/DeepSeek-R1", role: "refiner" },
];

const ROLE_LABELS: Record<PanelRole, string> = {
  generator: "Generator",
  critic: "Critic",
  refiner: "Refiner",
};

type FormValues = {
  startupIdea: string;
  targetAudience: string;
  industry: string;
  differentiator: string;
};

type BusinessGeneratorFormProps = {
  formValues: FormValues;
  selectedModel: string;
  isGenerating: boolean;
  onChange: (field: keyof FormValues, value: string) => void;
  onModelChange: (model: string) => void;
  onPanelChange: (panel: PanelAgentConfig[] | null) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

const optionalFields: Array<{
  field: Exclude<keyof FormValues, "startupIdea">;
  label: string;
  placeholder: string;
}> = [
  {
    field: "targetAudience",
    label: "Target Audience",
    placeholder: "Busy freelancers, early-stage founders, SMB finance teams...",
  },
  {
    field: "industry",
    label: "Industry",
    placeholder: "Fintech, healthtech, creator economy, climate...",
  },
  {
    field: "differentiator",
    label: "Unique Differentiator",
    placeholder: "What makes this idea stand out from existing solutions?",
  },
];

export function BusinessGeneratorForm({
  formValues,
  selectedModel,
  isGenerating,
  onChange,
  onModelChange,
  onPanelChange,
  onSubmit,
}: BusinessGeneratorFormProps) {
  const [usePanelMode, setUsePanelMode] = useState(false);
  const [panelAgents, setPanelAgents] = useState<PanelAgentConfig[]>(PANEL_DEFAULTS);

  const handleTogglePanel = (checked: boolean) => {
    setUsePanelMode(checked);
    onPanelChange(checked ? panelAgents : null);
  };

  const updateAgents = (updated: PanelAgentConfig[]) => {
    setPanelAgents(updated);
    if (usePanelMode) onPanelChange(updated);
  };

  const handleAgentModelChange = (index: number, model: string) => {
    updateAgents(panelAgents.map((agent, i) => (i === index ? { ...agent, model } : agent)));
  };

  const handleAgentRoleChange = (index: number, role: PanelRole) => {
    updateAgents(panelAgents.map((agent, i) => (i === index ? { ...agent, role } : agent)));
  };

  const handleAddAgent = () => {
    if (panelAgents.length < 4) {
      updateAgents([...panelAgents, { model: HF_MODELS[0].id, role: "refiner" }]);
    }
  };

  const handleRemoveAgent = (index: number) => {
    if (panelAgents.length > 2) {
      updateAgents(panelAgents.filter((_, i) => i !== index));
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-premium backdrop-blur-xl sm:p-8"
    >
      <div className="grid gap-6">
        <div>
          <label htmlFor="startupIdea" className="mb-2 block text-sm font-medium text-slate-200">
            Startup Idea
          </label>
          <textarea
            id="startupIdea"
            required
            rows={6}
            value={formValues.startupIdea}
            onChange={(event) => onChange("startupIdea", event.target.value)}
            placeholder="Describe the startup you want to build, the problem it solves, and who it helps."
            className="w-full resize-none rounded-[1.5rem] border border-white/10 bg-slate-950/70 px-4 py-4 text-slate-50 outline-none transition placeholder:text-slate-500 focus:border-orange-400/80 focus:ring-2 focus:ring-orange-400/30"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {optionalFields.map(({ field, label, placeholder }) => (
            <div key={field}>
              <label htmlFor={field} className="mb-2 block text-sm font-medium text-slate-200">
                {label}
              </label>
              <input
                id={field}
                type="text"
                value={formValues[field]}
                onChange={(event) => onChange(field, event.target.value)}
                placeholder={placeholder}
                className="w-full rounded-[1.25rem] border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-50 outline-none transition placeholder:text-slate-500 focus:border-orange-400/80 focus:ring-2 focus:ring-orange-400/30"
              />
            </div>
          ))}
        </div>

        {/* Model selector — hidden when panel mode is on */}
        {!usePanelMode && (
          <div>
            <label htmlFor="modelSelect" className="mb-2 block text-sm font-medium text-slate-200">
              Choose AI Model
            </label>
            <select
              id="modelSelect"
              value={selectedModel}
              onChange={(e) => onModelChange(e.target.value)}
              className="w-full rounded-[1.25rem] border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-50 outline-none transition focus:border-orange-400/80 focus:ring-2 focus:ring-orange-400/30 appearance-none cursor-pointer"
            >
              {HF_MODELS.map(({ id, label }) => (
                <option key={id} value={id} className="bg-slate-900 text-slate-50">
                  {label}
                </option>
              ))}
            </select>
            <p className="mt-1.5 text-xs text-slate-500">Powered by Hugging Face Inference API</p>
          </div>
        )}

        {/* Multi-agent panel section */}
        <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/40 px-5 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-200">Multi-Agent Panel</p>
              <p className="mt-0.5 text-xs text-slate-500">
                Run a Generator → Critic → Refiner exchange on each plan step
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={usePanelMode}
              onClick={() => handleTogglePanel(!usePanelMode)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400/50 ${
                usePanelMode ? "bg-orange-500" : "bg-slate-700"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ${
                  usePanelMode ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {usePanelMode && (
            <div className="mt-4 space-y-3">
              {panelAgents.map((agent, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="w-5 flex-shrink-0 text-center text-xs text-slate-500">
                    {index + 1}
                  </span>

                  <select
                    value={agent.model}
                    onChange={(e) => handleAgentModelChange(index, e.target.value)}
                    className="flex-1 rounded-[1rem] border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none transition focus:border-orange-400/80 focus:ring-2 focus:ring-orange-400/30 appearance-none cursor-pointer"
                  >
                    {HF_MODELS.map(({ id, label }) => (
                      <option key={id} value={id} className="bg-slate-900 text-slate-50">
                        {label}
                      </option>
                    ))}
                  </select>

                  <select
                    value={agent.role}
                    onChange={(e) => handleAgentRoleChange(index, e.target.value as PanelRole)}
                    className="w-32 flex-shrink-0 rounded-[1rem] border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none transition focus:border-orange-400/80 focus:ring-2 focus:ring-orange-400/30 appearance-none cursor-pointer"
                  >
                    {(Object.keys(ROLE_LABELS) as PanelRole[]).map((role) => (
                      <option key={role} value={role} className="bg-slate-900 text-slate-50">
                        {ROLE_LABELS[role]}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    disabled={panelAgents.length <= 2}
                    onClick={() => handleRemoveAgent(index)}
                    className="flex-shrink-0 rounded-full p-1.5 text-slate-500 transition hover:bg-white/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-30"
                    aria-label="Remove agent"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}

              {panelAgents.length < 4 && (
                <button
                  type="button"
                  onClick={handleAddAgent}
                  className="mt-1 flex items-center gap-1.5 text-xs text-orange-400 transition hover:text-orange-300"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add agent
                </button>
              )}

              <p className="pt-1 text-xs text-slate-600">
                Smart defaults: Llama 3.3 70B generates, DeepSeek V3 critiques, DeepSeek R1 refines.
                With 2 agents the critic also acts as refiner.
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-400">
            AI will turn your inputs into a polished business plan with market, product, and revenue
            guidance.
          </p>
          <button
            type="submit"
            disabled={isGenerating}
            className="inline-flex min-w-[180px] items-center justify-center rounded-full bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-300 px-6 py-3.5 font-semibold text-slate-950 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isGenerating ? "Generating..." : "Generate Plan"}
          </button>
        </div>
      </div>
    </form>
  );
}
