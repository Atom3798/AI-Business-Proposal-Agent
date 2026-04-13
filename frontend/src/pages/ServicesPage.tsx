import { Navbar } from "../components/Navbar";

const services = [
  {
    title: "Business plan generation",
    description: "Turn a startup concept into structured sections covering positioning, monetization, and launch planning."
  },
  {
    title: "Market analysis support",
    description: "Draft competitive framing and customer context that can be reviewed and refined with your team."
  },
  {
    title: "Revenue model thinking",
    description: "Move beyond abstract product ideas with monetization paths tied to the business concept."
  },
  {
    title: "MVP definition",
    description: "Clarify what belongs in a first release versus later expansion so scope stays realistic."
  },
  {
    title: "Pitch preparation",
    description: "Generate a presentable outline for slide-based storytelling once the business fundamentals are clearer."
  },
  {
    title: "Workspace exports",
    description: "Save or export plan content into text and JSON artifacts for review and iteration."
  }
];

export default function ServicesPage() {
  return (
    <div className="shell-page">
      <Navbar />

      <section className="page-hero">
        <span className="eyebrow">Capabilities</span>
        <h1 className="section-title mt-4">Services</h1>
        <p className="section-copy mt-5 max-w-3xl">
          The product is positioned as a planning assistant for founders and student teams.
          These service areas reflect the structure already present in the repo.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <div key={service.title} className="panel p-7">
              <h2 className="text-xl font-semibold text-foreground">{service.title}</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{service.description}</p>
            </div>
          ))}
        </div>

        <div className="panel mt-8 p-8">
          <p className="text-xs uppercase tracking-[0.28em] text-accent">Implementation note</p>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            The backend generation service is scaffolded, but the live API route integration is still pending.
            This UI redesign keeps the product credible while leaving room for that next engineering step.
          </p>
        </div>
      </section>
    </div>
  );
}
