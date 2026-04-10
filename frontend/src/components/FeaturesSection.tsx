export function FeaturesSection() {
  return (
    <section className="py-20 md:py-32 px-6 md:px-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Build Faster. Ship Harder.
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our AI agent is the biggest competitive advantage for founders in the modern tech environment
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: "⚡",
              title: "Enterprise-Grade Planning",
              description: "Get business plans that rival million-dollar consulting firms in seconds, not weeks"
            },
            {
              icon: "🚀",
              title: "Ship Faster",
              description: "Skip the planning paralysis. Validate, iterate, and launch your MVP drastically faster"
            },
            {
              icon: "🧠",
              title: "AI Agent Advantage",
              description: "Our proprietary AI understands startup dynamics and market forces like no other tool"
            },
            {
              icon: "📊",
              title: "Real-time Insights",
              description: "Competitive analysis, market sizing, and go-to-market strategies updated in real-time"
            },
            {
              icon: "🤝",
              title: "Built for Founders",
              description: "By founders, for founders. We understand what you need to succeed in today's tech landscape"
            },
            {
              icon: "🌍",
              title: "Global Scale",
              description: "Used by startups across 50+ countries to raise money and build billion-dollar companies"
            }
          ].map((feature, idx) => (
            <div
              key={idx}
              className="p-8 border border-border rounded-lg bg-background hover:bg-secondary/20 transition"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
