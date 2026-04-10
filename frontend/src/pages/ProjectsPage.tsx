import { Navbar } from "../components/Navbar";

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <section className="pt-32 px-6 md:px-16 max-w-6xl mx-auto pb-20">
        <div className="animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Our Projects
          </h1>
          <p className="text-xl text-muted-foreground mb-12">
            Cases and success stories powered by AI Business Generator
          </p>

          <div className="grid md:grid-cols-2 gap-8 mt-12">
            {[
              {
                title: "Fintech Startup Launch",
                description: "Helped a fintech founder validate product-market fit in 48 hours with AI-generated business plan"
              },
              {
                title: "SaaS Acceleration",
                description: "Enabled rapid pivoting for a SaaS company through iterative plan generation"
              },
              {
                title: "Marketplace MVP",
                description: "Generated comprehensive go-to-market strategy for a new marketplace platform"
              },
              {
                title: "Enterprise Integration",
                description: "Deployed AI planning system for corporate innovation teams at Fortune 500 company"
              }
            ].map((project, idx) => (
              <div
                key={idx}
                className="p-8 border border-border rounded-lg bg-secondary/20 hover:bg-secondary/40 transition"
              >
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {project.title}
                </h3>
                <p className="text-muted-foreground mb-4">{project.description}</p>
                <button className="text-primary font-semibold hover:text-primary/80 transition">
                  Learn More →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
