import { motion } from "motion/react";
import { Zap, Sparkles, Download, History, Lightbulb, Rocket } from "lucide-react";

export function Features() {
  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Generation",
      description: "Advanced LLM prompts generate 7 comprehensive business sections instantly"
    },
    {
      icon: Download,
      title: "Multiple Export Formats",
      description: "Download your plan as text, JSON, or share directly with investors"
    },
    {
      icon: History,
      title: "Plan History",
      description: "Save unlimited business plans and revisit them anytime"
    },
    {
      icon: Lightbulb,
      title: "Iterative Refinement",
      description: "Create variations of your plan with different audiences and differentiators"
    },
    {
      icon: Rocket,
      title: "Pitch-Ready Output",
      description: "All sections are formatted for investor presentations"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Generate comprehensive plans in under 5 seconds"
    }
  ];

  return (
    <section id="features" className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
      <div className="text-center mb-12">
        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
          Powerful Features for Founders
        </h2>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          Everything you need to transform your startup idea into an investor-ready business plan
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group rounded-xl border border-white/10 bg-white/[0.03] p-6 hover:border-orange-300/30 hover:bg-white/[0.06] transition"
            >
              <div className="mb-4 inline-flex p-3 rounded-lg bg-orange-300/10 text-orange-300 group-hover:scale-110 transition">
                <Icon size={24} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-400">{feature.description}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
