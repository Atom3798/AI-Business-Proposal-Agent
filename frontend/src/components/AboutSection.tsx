import { motion } from "motion/react";

const logos = ["Founders", "Advisors", "Student Teams", "Operators"];

export function AboutSection() {
  return (
    <section className="section-shell">
      <div className="shell-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="panel p-8 md:p-10"
        >
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <span className="eyebrow">Why this interface works</span>
              <h2 className="section-title mt-4">Structured enough for serious work, light enough to move quickly.</h2>
            </div>

            <div>
              <p className="section-copy">
                Strong AI business products usually avoid noisy dashboards and oversized claims. The better ones make the user feel like the system is clarifying a complex workflow, not performing a gimmick.
              </p>
              <p className="section-copy mt-4">
                This redesign leans into that pattern with cleaner surfaces, more disciplined spacing, calmer color contrast, and compact motion that helps guide the eye.
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {logos.map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.4 }}
                className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-center text-sm font-medium tracking-[0.18em] text-slate-200"
              >
                {item}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
