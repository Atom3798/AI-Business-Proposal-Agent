import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";

const stats = [
  { label: "Planning blocks generated", value: "7" },
  { label: "Core workflow", value: "Idea to pitch" },
  { label: "Output format", value: "Structured draft" }
];

const previewRows = [
  ["Value proposition", "Sharper positioning for a small-business finance copilot."],
  ["Target segment", "Freelancers and micro-agencies with inconsistent monthly cash flow."],
  ["Launch path", "Start in niche creator communities, then expand through accountant referrals."]
];

export const HeroSection = memo(function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden pt-28 md:pt-36">
      <div className="pointer-events-none absolute inset-0">
        <div className="grid-glow absolute inset-x-0 top-0 h-[48rem] opacity-30" />
        <motion.div
          animate={{ x: [0, 14, 0], y: [0, -12, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[8%] top-28 h-72 w-72 rounded-full bg-cyan-300/10 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -18, 0], y: [0, 10, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[6%] top-24 h-96 w-96 rounded-full bg-sky-100/10 blur-3xl"
        />
      </div>

      <div className="shell-container relative z-10 grid gap-14 pb-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <div className="mb-5 flex flex-wrap gap-3">
            <span className="glass-chip">AI planning workspace</span>
            <span className="glass-chip">Investor-ready structure</span>
          </div>

          <h1 className="max-w-4xl text-[clamp(3.25rem,8vw,6.5rem)] font-semibold leading-[0.94] tracking-[-0.065em] text-foreground">
            Clean business planning for founders who move fast.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
            Turn a rough startup concept into a sharper business case with a calm, structured interface
            built for positioning, market logic, monetization, and pitch preparation.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button className="hero-button-primary px-7 py-3.5" onClick={() => navigate("/plan")}>
              Open Workspace
            </button>
            <button className="hero-button-secondary px-7 py-3.5" onClick={() => navigate("/services")}>
              Explore Features
            </button>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {stats.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.08, duration: 0.45 }}
                className="panel-soft p-4"
              >
                <div className="metric-value text-2xl">{item.value}</div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.7, ease: "easeOut" }}
          className="relative"
        >
          <div className="panel relative overflow-hidden p-6 md:p-7">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-100/80 to-transparent" />

            <div className="flex items-center justify-between border-b border-white/10 pb-5">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-accent">Live plan preview</p>
                <h2 className="mt-2 text-2xl font-semibold text-foreground">AI CFO for creators</h2>
              </div>
              <div className="rounded-full border border-cyan-100/15 bg-cyan-100/10 px-3 py-1 text-xs text-cyan-50">
                Drafting
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {previewRows.map(([title, body], index) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.08, duration: 0.45 }}
                  className="rounded-[1.35rem] border border-white/10 bg-white/[0.03] p-4"
                >
                  <p className="text-xs uppercase tracking-[0.24em] text-accent">{title}</p>
                  <p className="mt-2 text-sm leading-7 text-slate-200">{body}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="panel-soft absolute -bottom-8 -left-4 hidden max-w-[16rem] p-4 md:block"
          >
            <p className="text-xs uppercase tracking-[0.24em] text-accent">Signal</p>
            <p className="mt-2 text-sm leading-6 text-slate-200">
              Motion is understated and supports hierarchy instead of competing with content.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
});
