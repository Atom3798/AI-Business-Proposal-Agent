import { memo } from "react";
import { useNavigate } from "react-router-dom";

export const HeroSection = memo(function HeroSection() {
  const navigate = useNavigate();

  return (
    <section 
      className="relative w-full h-screen flex items-center justify-start overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/vertical-shot-curvy-road-down-hill-with-city-buildings-distance-blue-sky.jpg')",
        backgroundAttachment: "fixed"
      }}
    >

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/60 to-black/30 z-[1] pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-[90%] sm:max-w-md lg:max-w-2xl px-6 md:px-10 py-20">
        {/* Heading */}
        <h1 className="text-[clamp(3rem,8vw,6rem)] font-bold leading-[1.05] tracking-[-0.05em] text-white mb-2 md:mb-4 uppercase pointer-events-none drop-shadow-lg">
          Transform Your Idea Into{" "}
          <span className="text-primary">Reality</span>
        </h1>

        {/* Subheading */}
        <p className="text-white/90 text-[clamp(1.125rem,2.5vw,1.875rem)] font-light mb-3 md:mb-6 pointer-events-none drop-shadow-md">
          Business plans built with AI.
        </p>

        {/* Description */}
        <p className="text-white/80 text-[clamp(0.875rem,1.5vw,1.25rem)] font-light mb-4 md:mb-8 max-w-xl pointer-events-none drop-shadow-md">
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
        <p className="text-white/70 text-xs font-light mt-4 md:mt-6 pointer-events-none drop-shadow-md">
          Trusted by founders. Used by accelerators. Built with the latest AI models.
        </p>
      </div>
    </section>
  );
});

