import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Copy, Check, ChevronDown, Download, FileJson } from "lucide-react";
import { BusinessPlan } from "../utils/storage";
import { downloadAsText, downloadAsJSON, copyToClipboard } from "../utils/export";

type PlanViewerProps = {
  title: string;
  idea: string;
  audience: string;
  industry: string;
  differentiator: string;
  plan: BusinessPlan;
};

const sectionConfig = [
  { key: "valueProposition" as const, title: "Value Proposition", icon: "💡" },
  { key: "customerPersonas" as const, title: "Customer Personas", icon: "👥" },
  { key: "competitiveAnalysis" as const, title: "Competitive Analysis", icon: "🎯" },
  { key: "revenueModel" as const, title: "Revenue Model", icon: "💰" },
  { key: "mvpFeatures" as const, title: "MVP Features", icon: "🚀" },
  { key: "goToMarketStrategy" as const, title: "Go-To-Market", icon: "📈" },
  { key: "pitchDeckOutline" as const, title: "Pitch Deck", icon: "🎤" }
];

export function PlanViewer({
  title,
  idea,
  audience,
  industry,
  differentiator,
  plan
}: PlanViewerProps) {
  const [activeTab, setActiveTab] = useState<keyof BusinessPlan>("valueProposition");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = async (text: string, index: number) => {
    try {
      await copyToClipboard(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      console.error("Failed to copy", error);
    }
  };

  const currentSection = sectionConfig.find((s) => s.key === activeTab);
  const content = plan[activeTab];
  const items = Array.isArray(content) ? content : [content];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mx-auto max-w-6xl px-6 py-12 space-y-8"
    >
      {/* Header */}
      <div className="space-y-4">
        <h2 className="text-4xl font-bold text-white">{title}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          {[
            { label: "Idea", value: idea.slice(0, 40) + "..." },
            { label: "Audience", value: audience || "Not specified" },
            { label: "Industry", value: industry || "Not specified" },
            { label: "Differentiator", value: differentiator || "Not specified" }
          ].map((item) => (
            <div key={item.label} className="rounded-lg border border-white/10 bg-white/5 p-3">
              <p className="text-xs text-slate-400">{item.label}</p>
              <p className="text-sm text-white truncate font-medium">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Export buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => downloadAsText(title, idea, audience, industry, differentiator, plan)}
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition"
        >
          <Download size={16} />
          Export as Text
        </button>
        <button
          onClick={() => downloadAsJSON(title, idea, audience, industry, differentiator, plan)}
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition"
        >
          <FileJson size={16} />
          Export as JSON
        </button>
      </div>

      {/* Tabs */}
      <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 border-b border-white/10 divide-x divide-white/10">
          {sectionConfig.map(({ key, title: sectionTitle, icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`
                px-4 py-4 text-center transition font-medium text-sm
                ${
                  activeTab === key
                    ? "bg-orange-300/10 text-orange-300 border-b-2 border-orange-300"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }
              `}
            >
              <div className="text-lg mb-1">{icon}</div>
              <div className="hidden sm:block text-xs">{sectionTitle}</div>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="text-3xl">{currentSection?.icon}</span>
                {currentSection?.title}
              </h3>

              <div className="space-y-3 pt-4">
                {items.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group relative rounded-lg border border-white/10 bg-white/[0.02] p-4 hover:border-orange-300/30 hover:bg-white/5 transition"
                  >
                    <p className="text-slate-200 leading-relaxed text-sm sm:text-base">{item}</p>
                    <button
                      onClick={() => handleCopy(item, idx)}
                      className="absolute top-3 right-3 rounded-md border border-white/10 bg-white/5 p-2 opacity-0 group-hover:opacity-100 transition hover:bg-white/10"
                      title="Copy to clipboard"
                    >
                      {copiedIndex === idx ? (
                        <Check size={14} className="text-green-400" />
                      ) : (
                        <Copy size={14} className="text-slate-400" />
                      )}
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  );
}
