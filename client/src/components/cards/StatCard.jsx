import { motion } from "framer-motion";

const StatCard = ({ title, value, trend, type }) => {
  const trendColor =
    type === "danger"
      ? "text-danger"
      : type === "warning"
      ? "text-warning"
      : "text-success";

  return (
    <motion.div
      className="card py-3 flex flex-col gap-1"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {/* Title */}
      <p className="text-xs text-gray-600 mb-1">
        {title}
      </p>

      {/* Value */}
      <div className="flex items-end justify-between">
        <h2 className="text-2xl font-semibold stat-number text-brand-dark">
          {value}
        </h2>

        {/* Trend */}
        <span
          className={`text-xs font-medium ${trendColor}`}
        >
          {trend}
        </span>
      </div>
    </motion.div>
  );
};

export default StatCard;