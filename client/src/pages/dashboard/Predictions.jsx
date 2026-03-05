import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, TrendingDown, Info } from "lucide-react";
import { getPredictionSummary } from "../../services/prediction.service";

const Predictions = () => {
  const [summary, setSummary] = useState({
    high: 0,
    medium: 0,
    low: 0,
  });

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const data = await getPredictionSummary();
        setSummary(data);
      } catch (err) {
        console.error("Prediction summary error:", err);
      }
    };

    loadSummary();
  }, []);

  const predictions = [
    {
      title: "High Churn Risk Customers",
      value: summary.high,
      trend: "High Impact",
      icon: AlertTriangle,
      color: "text-red-600",
      bg: "bg-red-50",
      description:
        "Customers showing strong signals of churn based on recent inactivity and usage drop.",
    },
    {
      title: "Medium Risk Customers",
      value: summary.medium,
      trend: "Moderate",
      icon: TrendingDown,
      color: "text-amber-600",
      bg: "bg-amber-50",
      description:
        "Customers with moderate engagement decline. Retention actions recommended.",
    },
    {
      title: "Low Risk Customers",
      value: summary.low,
      trend: "Stable",
      icon: Info,
      color: "text-green-700",
      bg: "bg-green-50",
      description:
        "Highly engaged customers with minimal churn probability.",
    },
  ];

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
          Churn Predictions
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          AI-powered churn risk analysis and explanations
        </p>
      </div>

      {/* Risk Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {predictions.map((item, idx) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={idx}
              className="card space-y-3"
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${item.bg}`}>
                  <Icon size={20} className={item.color} />
                </div>

                <span className="text-xs font-medium text-gray-500">
                  {item.trend}
                </span>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  {item.title}
                </p>
                <h2 className="text-3xl font-semibold text-brand-dark mt-1">
                  {item.value}
                </h2>
              </div>

              <p className="text-xs text-gray-500 leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Explanation Panel */}
      <div className="card">
        <h3 className="text-base font-semibold text-brand-dark mb-2">
          How predictions are calculated
        </h3>

        <p className="text-sm text-gray-600 leading-relaxed">
          ChurnGuard uses behavioral signals such as login frequency,
          feature usage, plan changes, and historical churn patterns
          to estimate churn probability.
        </p>

        <ul className="mt-3 space-y-2 text-sm text-gray-600">
          <li>• Sudden drop in activity</li>
          <li>• Reduced feature engagement</li>
          <li>• Subscription downgrades</li>
          <li>• Past churn trends from similar users</li>
        </ul>
      </div>
    </motion.div>
  );
};

export default Predictions;