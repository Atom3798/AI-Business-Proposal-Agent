import { motion } from "motion/react";

const cards = [
  {
    title: "Idea to narrative",
    body: "Start from a rough concept and transform it into a cleaner business story with stronger framing and less guesswork.",
    size: "lg:col-span-2"
  },
  {
    title: "Audience clarity",
    body: "Define the first customer segment before broadening the market story.",
    size: ""
  },
  {
    title: "MVP scope",
    body: "Separate must-have capabilities from expansion ideas so the plan stays credible.",
    size: ""
  },
  {
    title: "Revenue logic",
    body: "Connect monetization directly to product behavior and user value instead of treating it as an afterthought.",
    size: "lg:col-span-2"
  },
  {
    title: "Pitch prep",
    body: "Package the output into a presentation-friendly structure that can be exported and revised.",
    size: ""
  }
];

export function FeaturesSection() {
  return (
    <section className="section-shell">
      <div className="shell-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5 }}
          className="mb-12 max-w-3xl"
        >
          <span className="eyebrow">Core capabilities</span>
          <h2 className="section-title mt-4">A cleaner product story with a more modern AI-business layout.</h2>
          <p className="section-copy mt-5">
            The page now follows the same patterns used by stronger AI product sites: concise proof, modular content blocks, and bento-style visual grouping.
          </p>
        </motion.div>

        <div className="grid gap-5 lg:grid-cols-3">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.06, duration: 0.45 }}
              className={`panel group p-7 transition hover:-translate-y-1 hover:border-cyan-100/20 ${card.size}`}
            >
              <div className="mb-8 h-12 w-12 rounded-2xl border border-cyan-100/15 bg-gradient-to-br from-cyan-100/15 to-transparent" />
              <h3 className="text-2xl font-semibold tracking-[-0.03em] text-foreground">{card.title}</h3>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">{card.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
