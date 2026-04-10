import { Navbar } from "../components/Navbar";

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <section className="pt-32 px-6 md:px-16 max-w-6xl mx-auto pb-20">
        <div className="animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Our Services
          </h1>
          <p className="text-xl text-muted-foreground mb-12">
            Comprehensive AI-powered business planning tools for entrepreneurs
          </p>

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {[
              {
                title: "Business Plan Generation",
                description: "AI-generated comprehensive business plans in seconds"
              },
              {
                title: "Market Analysis",
                description: "Deep competitive analysis and market research powered by AI"
              },
              {
                title: "Financial Modeling",
                description: "Revenue models and financial projections built by our AI"
              },
              {
                title: "Go-To-Market Strategy",
                description: "Customized GTM strategies tailored to your business"
              },
              {
                title: "Chat Support",
                description: "Real-time AI chatbot for planning assistance"
              },
              {
                title: "Export & Sharing",
                description: "Generate pitch-ready documents and share plans easily"
              }
            ].map((service, idx) => (
              <div
                key={idx}
                className="p-6 border border-border rounded-lg bg-secondary/20 hover:bg-secondary/40 transition"
              >
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  {service.title}
                </h3>
                <p className="text-muted-foreground">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
