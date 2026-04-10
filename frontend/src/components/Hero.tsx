import { memo } from "react";
import { useNavigate } from "react-router-dom";

export const HeroSection = memo(function HeroSection() {
  const navigate = useNavigate();

  return (
    <section 
      className="relative w-full h-screen flex items-end overflow-hidden"
    >

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40 z-[1] pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-[90%] sm:max-w-md lg:max-w-2xl px-6 md:px-10 pb-10 md:pb-10 pt-32">
        {/* Heading */}
        <h1 className="text-[clamp(3rem,8vw,6rem)] font-bold leading-[1.05] tracking-[-0.05em] text-foreground mb-2 md:mb-4 uppercase pointer-events-none">
          Transform Your Idea Into{" "}
          <span className="text-primary">Reality</span>
        </h1>

        {/* Subheading */}
        <p className="text-foreground/80 text-[clamp(1.125rem,2.5vw,1.875rem)] font-light mb-3 md:mb-6 pointer-events-none">
          Business plans built with AI.
        </p>

        {/* Description */}
        <p className="text-muted-foreground text-[clamp(0.875rem,1.5vw,1.25rem)] font-light mb-4 md:mb-8 max-w-xl pointer-events-none">
          Go from startup idea to investor-ready business plan in seconds. AI-powered market analysis, competitive positioning, revenue models, and go-to-market strategies. All the insights founders need, none of the work.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-3 font-bold">
          <button className="hero-button-primary cursor-pointer" onClick={() => navigate("/plan")}>
            Generate Plan Now
          </button>
          <button className="hero-button-secondary cursor-pointer" onClick={() => navigate("/chat")}>
            Chat with AI
          </button>
        </div>

        {/* Trust Line */}
        <p className="text-muted-foreground/60 text-xs font-light mt-4 md:mt-6 pointer-events-none">
          Trusted by founders. Used by accelerators. Built with the latest AI models.
        </p>
      </div>
    </section>
  );
});

