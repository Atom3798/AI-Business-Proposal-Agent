import { motion } from "motion/react";
import { Trash2, Eye, Calendar } from "lucide-react";
import { SavedPlan, deletePlan } from "../utils/storage";

type PlanHistoryProps = {
  plans: SavedPlan[];
  onViewPlan: (plan: SavedPlan) => void;
};

export function PlanHistory({ plans, onViewPlan }: PlanHistoryProps) {
  if (plans.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-12 text-center">
        <p className="text-slate-400">No saved plans yet. Create your first one above!</p>
      </div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-6xl px-6 py-12"
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Your Business Plans</h2>
        <p className="text-slate-400">Manage and revisit your previously generated plans</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group rounded-xl border border-white/10 bg-white/[0.03] p-5 hover:border-orange-300/30 hover:bg-white/[0.06] transition"
          >
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-white group-hover:text-orange-300 transition line-clamp-2">
                  {plan.title}
                </h3>
                <p className="text-sm text-slate-400 line-clamp-2 mt-2">{plan.startupIdea}</p>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Calendar size={14} />
                <span>{new Date(plan.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => onViewPlan(plan)}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-orange-300/30 bg-orange-300/10 px-3 py-2 text-sm font-medium text-orange-200 hover:bg-orange-300/20 transition"
                >
                  <Eye size={14} />
                  View
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete "${plan.title}"?`)) {
                      deletePlan(plan.id);
                      window.location.reload();
                    }
                  }}
                  className="inline-flex items-center justify-center rounded-lg border border-red-300/20 bg-red-300/5 px-3 py-2 text-sm text-red-300/60 hover:bg-red-300/10 transition"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
