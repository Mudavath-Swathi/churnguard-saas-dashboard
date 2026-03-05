import { motion } from "framer-motion";
import {
  Lightbulb,
  TrendingDown,
  Users,
  ShieldCheck,
} from "lucide-react";


const insights = [
  {
    title: "High-risk customers inactive for 14+ days",
    impact: "High Impact",
    icon: TrendingDown,
    color: "text-red-600",
    bg: "bg-red-50",
    recommendation:
      "Trigger win-back emails and offer limited-time discounts to re-engage users.",
  },
  {
    title: "Medium-risk users underutilizing core features",
    impact: "Medium Impact",
    icon: Users,
    color: "text-amber-600",
    bg: "bg-amber-50",
    recommendation:
      "Introduce in-app tooltips, onboarding nudges, and feature education campaigns.",
  },
  {
    title: "Retention improving among premium plan users",
    impact: "Positive Trend",
    icon: ShieldCheck,
    color: "text-green-700",
    bg: "bg-green-50",
    recommendation:
      "Promote premium plan benefits to free and basic users through targeted messaging.",
  },
];

const Insights = () => {
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-brand-dark">
          Actionable Insights
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Recommendations generated from customer behavior & churn signals
        </p>
      </div>

      {/* Insight Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {insights.map((item, idx) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={idx}
              className="card space-y-4"
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 260 }}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`p-2 rounded-lg ${item.bg}`}
                >
                  <Icon size={20} className={item.color} />
                </div>

                <span className="text-xs font-medium text-gray-500">
                  {item.impact}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-brand-dark">
                  {item.title}
                </h3>
              </div>

              <div className="pt-2 border-t border-default">
                <p className="text-xs text-gray-500 mb-1">
                  Recommended Action
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {item.recommendation}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Strategy Panel */}
      <div className="card">
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb size={18} className="text-brand" />
          <h3 className="text-base font-semibold text-brand-dark">
            Retention Strategy Summary
          </h3>
        </div>

        <p className="text-sm text-gray-600 leading-relaxed">
          ChurnGuard continuously monitors customer engagement, usage patterns,
          and lifecycle signals to surface insights that directly impact retention.
          These recommendations are designed to help teams take quick,
          data-backed actions before churn occurs.
        </p>

        <ul className="mt-3 space-y-2 text-sm text-gray-600">
          <li>• Focus retention efforts on high-risk segments first</li>
          <li>• Educate medium-risk users before disengagement deepens</li>
          <li>• Leverage positive trends to scale successful strategies</li>
        </ul>
      </div>
    </motion.div>
  );
};

export default Insights;