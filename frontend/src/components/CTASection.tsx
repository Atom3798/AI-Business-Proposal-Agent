import { useNavigate } from "react-router-dom";

export function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="py-20 md:py-32 px-6 md:px-16">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
          Ready to Transform Your Idea?
        </h2>
        <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
          Join thousands of founders who've used our AI agent to go from idea to investor-ready business plan in minutes. Start building with the power of the Bay Area's biggest tech advantage.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate("/chat")}
            className="hero-button-primary text-lg px-8 py-4"
          >
            Start Generating Now
          </button>
          <button
            onClick={() => navigate("/services")}
            className="hero-button-secondary text-lg px-8 py-4"
          >
            Learn More
          </button>
        </div>

        <p className="text-muted-foreground/60 text-sm mt-8">
          No credit card required. Start building in seconds.
        </p>
      </div>
    </section>
  );
}
