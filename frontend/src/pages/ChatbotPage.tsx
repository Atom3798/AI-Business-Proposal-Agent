import { useState } from "react";
import { Navbar } from "../components/Navbar";

const quickPrompts = [
  "Turn this startup idea into a stronger value proposition",
  "What customer segment should we prioritize first?",
  "Suggest a cleaner revenue model for this concept",
  "Outline a sharper go-to-market approach"
];

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    {
      role: "assistant",
      content:
        "Welcome to the planning workspace. Share a startup concept, market angle, or product question and I will help structure it into a more coherent business narrative."
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = (message = input) => {
    if (!message.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      const responses = [
        "A strong next step is to tighten the target customer definition before expanding the feature set. That usually improves the rest of the plan as well.",
        "This concept would benefit from a clearer wedge: define one customer segment, one painful problem, and one measurable outcome before broadening the story.",
        "The business case looks more credible when the monetization model is tied directly to user behavior instead of added as a generic afterthought.",
        "I would revise this into a planning sequence: problem, user, product promise, differentiation, monetization, and launch channel."
      ];

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: responses[Math.floor(Math.random() * responses.length)] }
      ]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="shell-page">
      <Navbar />

      <section className="page-hero">
        <span className="eyebrow">Planning Workspace</span>
        <h1 className="section-title mt-4">AI assistant</h1>
        <p className="section-copy mt-5 max-w-3xl">
          This is still a mock workspace in the current repo, but the interface now presents it like a serious planning tool rather than a casual chatbot.
        </p>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="panel overflow-hidden">
            <div className="border-b border-white/10 px-6 py-5">
              <p className="text-xs uppercase tracking-[0.28em] text-accent">Conversation</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Use this area to refine the problem statement, audience, monetization model, and launch strategy.
              </p>
            </div>

            <div className="space-y-4 px-6 py-6">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-2xl rounded-3xl px-5 py-4 text-sm leading-7 ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "border border-white/10 bg-white/[0.03] text-slate-100"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-3xl border border-white/10 bg-white/[0.03] px-5 py-4">
                    <div className="flex gap-2">
                      <div className="h-2 w-2 animate-pulse rounded-full bg-cyan-100/60" />
                      <div className="h-2 w-2 animate-pulse rounded-full bg-cyan-100/60" style={{ animationDelay: "0.1s" }} />
                      <div className="h-2 w-2 animate-pulse rounded-full bg-cyan-100/60" style={{ animationDelay: "0.2s" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-white/10 px-6 py-5">
              <div className="mb-4 flex flex-wrap gap-2">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSend(prompt)}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-slate-200 transition hover:bg-white/[0.06]"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Describe your startup, audience, or a planning question..."
                  className="flex-1 rounded-full border border-white/10 bg-slate-950/40 px-5 py-3 text-foreground outline-none transition focus:border-cyan-200/40 focus:ring-2 focus:ring-cyan-200/15"
                  disabled={loading}
                />
                <button
                  onClick={() => handleSend()}
                  disabled={loading || !input.trim()}
                  className="hero-button-primary disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Send
                </button>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="panel p-6">
              <p className="text-xs uppercase tracking-[0.28em] text-accent">Workspace status</p>
              <h2 className="mt-3 text-2xl font-semibold text-foreground">Frontend polished</h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                This screen is still using simulated responses. The next meaningful implementation step is wiring the real FastAPI generation flow into a proper planning form.
              </p>
            </div>

            <div className="panel p-6">
              <p className="text-xs uppercase tracking-[0.28em] text-accent">Recommended next step</p>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                Replace the mock conversation path with the business generator form and render the saved/exportable sections using the existing plan-view components already in the repo.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
