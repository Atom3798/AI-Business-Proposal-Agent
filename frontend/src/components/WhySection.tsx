import { motion } from "motion/react";

const steps = [
  {
    number: "01",
    title: "Capture the idea",
    body: "Start with a rough description of the problem, user, and differentiator."
  },
  {
    number: "02",
    title: "Structure the business case",
    body: "Generate clearer sections for positioning, customer definition, monetization, and launch."
  },
  {
    number: "03",
    title: "Refine for presentation",
    body: "Use the output as a draft for pitch prep, evaluation, or team discussion."
  }
];

export function WhySection() {
  return (
    <section className="section-shell">
      <div className="shell-container">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.5 }}
          >
            <span className="eyebrow">Workflow</span>
            <h2 className="section-title mt-4">The motion and layout are there to explain the product, not distract from it.</h2>
            <p className="section-copy mt-5">
              The strongest AI business sites tend to feel editorial and product-led at the same time. This section makes the workflow explicit and gives the page a more intuitive reading rhythm.
            </p>
          </motion.div>

          <div className="space-y-5">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: 18 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.08, duration: 0.45 }}
                className="panel flex gap-5 p-6 md:p-7"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-cyan-100/15 bg-cyan-100/10 text-sm font-semibold tracking-[0.18em] text-accent">
                  {step.number}
                </div>
                <div>
                  <h3 className="text-2xl font-semibold tracking-[-0.03em] text-foreground">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{step.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
