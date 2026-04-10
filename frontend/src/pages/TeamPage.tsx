import { Navbar } from "../components/Navbar";

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <section className="pt-32 px-6 md:px-16 max-w-6xl mx-auto pb-20">
        <div className="animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Our Team
          </h1>
          <p className="text-xl text-muted-foreground mb-12">
            Builders, creators, and AI experts making enterprise planning accessible
          </p>

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {[
              {
                role: "CEO & Co-Founder",
                description: "Former startup founder with 10+ years in business strategy"
              },
              {
                role: "CTO & Co-Founder",
                description: "AI/ML expert from leading tech companies"
              },
              {
                role: "Head of Product",
                description: "Design-focused product leader from venture studios"
              },
              {
                role: "Lead Engineer",
                description: "Full-stack engineer passionate about UX and performance"
              },
              {
                role: "AI Research Lead",
                description: "PhD in NLP, formerly at leading AI research labs"
              },
              {
                role: "Growth Lead",
                description: "Growth marketer with B2B SaaS expertise"
              }
            ].map((member, idx) => (
              <div
                key={idx}
                className="p-6 border border-border rounded-lg bg-secondary/20 hover:bg-secondary/40 transition text-center"
              >
                <div className="w-20 h-20 bg-primary/20 rounded-full mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {member.role}
                </h3>
                <p className="text-muted-foreground text-sm">{member.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 p-8 border border-border rounded-lg bg-secondary/20 text-center">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              We're Hiring
            </h2>
            <p className="text-muted-foreground mb-6">
              Join our team and help shape the future of business planning
            </p>
            <button className="hero-button-primary">
              View Open Positions
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
