export function AboutSection() {
  return (
    <section className="py-20 md:py-32 px-6 md:px-16">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Who We Are
            </h2>
            <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
              We're a team of AI experts, startup founders, and business strategists building in the Bay Area—right in the heart of the tech ecosystem where the best startups are born.
            </p>
            <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
              Located near the world's best startup schools like Y Combinator and inside Silicon Valley's fastest-growing tech environment, we're obsessed with helping founders turn ideas into reality faster.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Our AI agent is built to be the biggest tech advantage for builders—giving you enterprise-grade business planning in seconds so you can focus on shipping and scaling.
            </p>
          </div>

          <div />
        </div>
      </div>
    </section>
  );
}
