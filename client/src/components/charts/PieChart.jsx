import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import { useEffect, useState } from "react";
import { getRiskDistribution } from "../../services/dashboard.service";

const RISK_COLORS = {
  low: "var(--color-success)",
  medium: "var(--color-warning)",
  high: "var(--color-danger)",
};

const PieChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const loadRiskDistribution = async () => {
      try {
        const res = await getRiskDistribution();

        const formatted = res.map(item => ({
          risk: item._id, // "low" | "medium" | "high"
          name:
            item._id === "low"
              ? "Low Risk"
              : item._id === "medium"
              ? "Medium Risk"
              : "High Risk",
          value: item.value,
        }));

        setData(formatted);
      } catch (err) {
        console.error("Risk distribution error", err);
      }
    };

    loadRiskDistribution();
  }, []);

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="h-[160px]">
        <ResponsiveContainer width="100%" height="100%">
          <RePieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={55}
              outerRadius={80}
              cx="50%"
              cy="50%"
              stroke="none"
            >
              {data.map((item) => (
                <Cell
                  key={item.risk}
                  fill={RISK_COLORS[item.risk]}
                />
              ))}
            </Pie>

            <Tooltip
              formatter={(value) => [`${value}`, "Customers"]}
            />
          </RePieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-3 flex justify-center gap-6 text-xs text-gray-600">
        {data.map((item) => (
          <div key={item.risk} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: RISK_COLORS[item.risk] }}
            />
            {item.name}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default PieChart;