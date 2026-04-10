import { motion } from "motion/react";
import { Sparkles, ArrowRight } from "lucide-react";

type CTAProps = {
  onStart: () => void;
};

export function CTA({ onStart }: CTAProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative mx-auto max-w-4xl px-6 py-16 sm:py-20"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 rounded-2xl bg-gradient-to-r from-orange-400/10 via-amber-300/10 to-emerald-300/10" />

      <div className="rounded-2xl border border-orange-300/20 bg-gradient-to-r from-orange-400/5 via-amber-300/5 to-emerald-300/5 backdrop-blur-xl p-8 sm:p-12 text-center space-y-6">
        <h2 className="text-4xl sm:text-5xl font-bold text-white">
          Ready to Transform Your Idea?
        </h2>
        
        <p className="text-lg text-slate-300 max-w-2xl mx-auto">
          Stop stalling on your business plan. Create a comprehensive, investor-ready plan in seconds with AI Business Generator.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <button
            onClick={onStart}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-300 px-8 py-4 font-semibold text-slate-950 hover:scale-105 transition shadow-lg shadow-orange-500/30"
          >
            <Sparkles size={20} />
            Generate Your Plan Now
            <ArrowRight size={20} />
          </button>
          <a
            href="#features"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-4 font-semibold text-white hover:bg-white/10 transition"
          >
            Learn More
          </a>
        </div>
      </div>
    </motion.section>
  );
}
