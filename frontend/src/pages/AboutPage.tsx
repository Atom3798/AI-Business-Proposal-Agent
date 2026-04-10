import { Navbar } from "../components/Navbar";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <section className="pt-32 px-6 md:px-16 max-w-6xl mx-auto pb-20">
        <div className="animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            About Us
          </h1>
          <p className="text-xl text-muted-foreground mb-12">
            Building the future of business planning with AI
          </p>

          <div className="grid md:grid-cols-2 gap-12 mt-12">
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Our Mission
              </h2>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                We're on a mission to democratize business planning. Most founders spend weeks building business plans. We reduce that to seconds using advanced AI technology.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                AI Business Generator empowers founders to focus on execution instead of planning, giving them the insights they need to move fast and validate their ideas.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Why We Exist
              </h2>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Writing a business plan is tedious and often delays idea validation. Entrepreneurs need structured frameworks and actionable insights—not busy work.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                By combining cutting-edge AI models with best-practice business frameworks, we've built a tool that generates investor-ready plans in seconds.
              </p>
            </div>
          </div>

          <div className="mt-16 p-8 border border-border rounded-lg bg-secondary/20">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              By The Numbers
            </h2>
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { number: "10K+", label: "Plans Generated" },
                { number: "95%", label: "User Satisfaction" },
                { number: "50+", label: "Countries" },
                { number: "2min", label: "Avg Plan Time" }
              ].map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {stat.number}
                  </div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
