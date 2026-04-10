import { useState } from "react";
import { Navbar } from "../components/Navbar";

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    {
      role: "assistant",
      content: "Hey! 👋 I'm your AI business planning assistant. Ask me anything about creating a business plan, market research, go-to-market strategies, or anything else to help with your startup idea!"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = input;
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "That's a great question! Let me help you think through that. " + userMessage.toLowerCase().substring(0, 30) + "... is a key aspect of building a strong business.",
        "Interesting point! Here are some considerations: 1) Market validation, 2) Competitive positioning, 3) Revenue model feasibility.",
        "I'd recommend starting with thorough market research. Your idea of " + userMessage.substring(0, 20) + "... shows promise!",
        "Let's break this down: First, define your target audience clearly. Second, validate your assumptions. Third, create a repeatable GTM playbook."
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setMessages(prev => [...prev, { role: "assistant", content: randomResponse }]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex flex-col pt-24 pb-4">
        <div className="max-w-4xl mx-auto w-full px-4 flex flex-col h-full">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Chat with AI Assistant
            </h1>
            <p className="text-muted-foreground">
              Get help building your business plan in real-time
            </p>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto mb-6 space-y-4 bg-secondary/10 rounded-lg p-6">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs px-4 py-3 rounded-lg ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary/30 text-foreground border border-border"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-secondary/30 text-foreground border border-border px-4 py-3 rounded-lg">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-muted rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-muted rounded-full animate-pulse" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-muted rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask me something about your business idea..."
              className="flex-1 px-4 py-3 bg-secondary/20 border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition"
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="hero-button-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
