import { motion } from "motion/react";
import { ChevronRight, Sparkles } from "lucide-react";

type FormValues = {
  startupIdea: string;
  targetAudience: string;
  industry: string;
  differentiator: string;
};

type EnhancedFormProps = {
  formValues: FormValues;
  isGenerating: boolean;
  onChange: (field: keyof FormValues, value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

const fields: Array<{
  field: keyof FormValues;
  label: string;
  placeholder: string;
  required?: boolean;
  rows?: number;
  helpText?: string;
  helpful?: string;
}> = [
  {
    field: "startupIdea",
    label: "Your Startup Idea",
    placeholder: "Describe the problem you're solving, your solution, and the impact...",
    required: true,
    rows: 4,
    helpText: "Be specific about the problem, target customer, and your unique approach"
  },
  {
    field: "targetAudience",
    label: "Target Audience",
    placeholder: "e.g., Freelance designers, early-stage SaaS founders, SMB finance teams...",
    required: false,
    helpful: "Who are your ideal customers?"
  },
  {
    field: "industry",
    label: "Industry/Market",
    placeholder: "e.g., Fintech, Healthtech, Creator Economy, Climate Tech...",
    required: false,
    helpful: "Which market are you entering?"
  },
  {
    field: "differentiator",
    label: "Unique Differentiator",
    placeholder: "What makes your solution stand out from existing competitors?",
    required: false,
    helpful: "Your competitive advantage"
  }
];

export function EnhancedForm({
  formValues,
  isGenerating,
  onChange,
  onSubmit
}: EnhancedFormProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mx-auto max-w-4xl px-6 py-12"
    >
      <div className="mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
          Transform Your Idea
        </h2>
        <p className="text-slate-400">
          Fill in your startup details and our AI will generate a comprehensive business plan
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-8">
        {/* Main startup idea */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-300/20 text-orange-300 font-semibold text-xs">
              1
            </div>
            <label className="block text-sm font-semibold text-white">
              {fields[0].label}
              <span className="text-orange-300">*</span>
            </label>
          </div>
          <p className="text-xs text-slate-400 ml-8">{fields[0].helpText}</p>
          <textarea
            value={formValues.startupIdea}
            onChange={(e) => onChange("startupIdea", e.target.value)}
            placeholder={fields[0].placeholder}
            rows={4}
            required
            className="w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white placeholder:text-slate-500 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/30 outline-none transition"
          />
        </motion.div>

        {/* Optional fields grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-500/20 text-slate-400 font-semibold text-xs">
              2-4
            </div>
            <label className="block text-sm font-semibold text-white">
              Additional Details <span className="font-normal text-slate-400">(optional)</span>
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {fields.slice(1).map((field, idx) => (
              <motion.div
                key={field.field}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + idx * 0.05 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-slate-200">
                    {field.label}
                  </label>
                  <span className="text-xs text-slate-500">Optional</span>
                </div>
                <input
                  type="text"
                  value={formValues[field.field]}
                  onChange={(e) => onChange(field.field, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full rounded-lg border border-white/10 bg-slate-950/50 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/30 outline-none transition"
                />
                <p className="text-xs text-slate-500">{field.helpful}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Submit button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between pt-4 border-t border-white/10"
        >
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-200">Ready to generate?</p>
            <p className="text-xs text-slate-500">Your AI plan will be generated in 2-5 seconds</p>
          </div>

          <button
            type="submit"
            disabled={isGenerating}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-300 px-8 py-3.5 font-semibold text-slate-950 transition hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-orange-500/30 whitespace-nowrap"
          >
            {isGenerating ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-slate-950" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Generate Plan
                <ChevronRight size={18} />
              </>
            )}
          </button>
        </motion.div>
      </form>
    </motion.section>
  );
}
