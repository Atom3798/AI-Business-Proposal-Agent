import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";

export function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="section-shell pb-24">
      <div className="shell-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="panel relative overflow-hidden px-8 py-10 text-center md:px-12 md:py-14"
        >
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 rounded-full bg-cyan-200/10 blur-3xl" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-100/70 to-transparent" />
          </div>

          <span className="eyebrow relative z-10">Start here</span>
          <h2 className="relative z-10 mx-auto mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.05em] text-foreground md:text-5xl">
            A cleaner AI product site should make the next action feel obvious.
          </h2>
          <p className="relative z-10 mx-auto mt-6 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
            Open the workspace, test the current mock planning flow, and then iterate toward the real end-to-end business generator.
          </p>

          <div className="relative z-10 mt-9 flex flex-col justify-center gap-4 sm:flex-row">
            <button
              onClick={() => navigate("/plan")}
              className="hero-button-primary px-8 py-3.5 text-base"
            >
              Open Workspace
            </button>
            <button
              onClick={() => navigate("/about")}
              className="hero-button-secondary px-8 py-3.5 text-base"
            >
              Review Product Story
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
