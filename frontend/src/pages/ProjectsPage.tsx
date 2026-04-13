import { Navbar } from "../components/Navbar";

const examples = [
  {
    title: "Freelancer finance assistant",
    description: "An AI-first planning draft focused on recurring cash flow visibility, tax readiness, and monthly runway guidance."
  },
  {
    title: "Vertical SaaS launch",
    description: "A structured outline for a niche B2B SaaS product with defined users, feature sequencing, and launch channels."
  },
  {
    title: "Campus marketplace concept",
    description: "A go-to-market and differentiation framework for a student-focused marketplace with limited initial scope."
  },
  {
    title: "Internal venture planning",
    description: "A cleaner narrative for innovation teams exploring new product directions inside larger organizations."
  }
];

export default function ProjectsPage() {
  return (
    <div className="shell-page">
      <Navbar />

      <section className="page-hero">
        <span className="eyebrow">Example Use Cases</span>
        <h1 className="section-title mt-4">Projects</h1>
        <p className="section-copy mt-5 max-w-3xl">
          These examples reflect the kinds of startup and venture planning scenarios the product is designed to support.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {examples.map((project) => (
            <div key={project.title} className="panel p-8">
              <p className="text-xs uppercase tracking-[0.28em] text-accent">Example</p>
              <h2 className="mt-3 text-2xl font-semibold text-foreground">{project.title}</h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">{project.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
