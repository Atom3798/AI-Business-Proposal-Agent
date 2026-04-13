export function WhySection() {
  return (
    <section className="py-20 md:py-32 px-6 md:px-16 bg-background/95 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Why Built in the Bay
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We're not just building a tool—we're building in the epicenter of startup innovation
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div />

          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold text-primary mb-3">
                🏆 Near Y Combinator & Best Startup Schools
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Located in Silicon Valley's startup epicenter, we're surrounded by the best founders, investors, and builders. This proximity allows us to deeply understand what founders actually need.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-primary mb-3">
                ⚙️ Biggest Tech Environment
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                We're building with access to cutting-edge AI models, proven technical infrastructure, and the world's best engineering talent. Our tech stack is built on the latest advancements.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-primary mb-3">
                🚢 Built to Ship Fast
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                In the fastest-moving tech environment in the world, we iterate weekly. Our AI agent learns from thousands of startup interactions, getting smarter and more valuable every single day.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-primary mb-3">
                🎯 Founder-First Philosophy
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Every single team member has founded or worked at startups. We build for the problems we've lived through, with the urgency of founders who get it.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
