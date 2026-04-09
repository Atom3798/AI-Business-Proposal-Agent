type FormValues = {
  startupIdea: string;
  targetAudience: string;
  industry: string;
  differentiator: string;
};

type BusinessGeneratorFormProps = {
  formValues: FormValues;
  isGenerating: boolean;
  onChange: (field: keyof FormValues, value: string) => void;
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
    placeholder: "Busy freelancers, early-stage founders, SMB finance teams..."
  },
  {
    field: "industry",
    label: "Industry",
    placeholder: "Fintech, healthtech, creator economy, climate..."
  },
  {
    field: "differentiator",
    label: "Unique Differentiator",
    placeholder: "What makes this idea stand out from existing solutions?"
  }
];

export function BusinessGeneratorForm({
  formValues,
  isGenerating,
  onChange,
  onSubmit
}: BusinessGeneratorFormProps) {
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

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-400">
            AI will turn your inputs into a polished business plan with market, product, and revenue guidance.
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
