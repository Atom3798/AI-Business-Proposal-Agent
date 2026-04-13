import { Navbar } from "../components/Navbar";

const roles = [
  "Product and UX direction",
  "Backend and LLM orchestration",
  "Frontend implementation",
  "Evaluation and system integration",
  "Prompt design and output refinement",
  "Documentation and presentation support"
];

export default function TeamPage() {
  return (
    <div className="shell-page">
      <Navbar />

      <section className="page-hero">
        <span className="eyebrow">Team Structure</span>
        <h1 className="section-title mt-4">Team</h1>
        <p className="section-copy mt-5 max-w-3xl">
          The project spans product design, frontend polish, backend generation logic, and evaluation. This page now presents that more cleanly than the previous placeholder team cards.
        </p>

        <div className="panel mt-12 p-8 md:p-10">
          <h2 className="text-2xl font-semibold text-foreground">Core responsibilities</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {roles.map((role) => (
              <div key={role} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-sm leading-7 text-slate-200">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
