import { Navbar } from "../components/Navbar";

const principles = [
  {
    title: "Structured by design",
    body: "The product is organized around the business questions founders actually need to answer, not around generic chat interactions."
  },
  {
    title: "Readable outputs",
    body: "Generated sections are intended to be edited, exported, and discussed with collaborators, mentors, or evaluators."
  },
  {
    title: "Professional tone",
    body: "The redesign avoids flashy styling so the interface feels suitable for planning, review, and presentation prep."
  }
];

export default function AboutPage() {
  return (
    <div className="shell-page">
      <Navbar />

      <section className="page-hero">
        <span className="eyebrow">Product Context</span>
        <h1 className="section-title mt-4">About</h1>
        <p className="section-copy mt-5 max-w-3xl">
          AI Business Generator is intended to help transform a startup idea into a more coherent business case through a structured AI workflow.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="panel p-8 md:p-10">
            <h2 className="text-2xl font-semibold text-foreground">Mission</h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              Reduce the friction between an early concept and a presentable planning draft. Instead of spending days organizing scattered thoughts,
              users should be able to start with a short description and quickly develop a clearer business narrative.
            </p>
          </div>

          <div className="panel p-8 md:p-10">
            <h2 className="text-2xl font-semibold text-foreground">Approach</h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              The system uses prompt-chained generation to separate core business concerns into focused sections such as value proposition,
              personas, competitive framing, revenue model, MVP definition, and launch strategy.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {principles.map((item) => (
            <div key={item.title} className="panel p-7">
              <h2 className="text-xl font-semibold text-foreground">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
