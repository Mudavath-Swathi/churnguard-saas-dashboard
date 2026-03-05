import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useEffect, useState } from "react";
import { getChurnTrends } from "../../services/churn.service";

const LineChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const loadTrends = async () => {
      try {
        const res = await getChurnTrends();

        // Transform backend data → chart format
        const formatted = res.map((item) => ({
          date: item._id,   // keep as-is (no UI change)
          value: item.value,
        }));

        setData(formatted);
      } catch (err) {
        console.error("Churn trends error", err);
      }
    };

    loadTrends();
  }, []);

  return (
    <motion.div
      className="w-full h-full"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <ReLineChart data={data}>
          {/* Grid */}
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--color-border)"
            vertical={false}
          />

          {/* X Axis */}
          <XAxis
            dataKey="date"
            tick={{ fill: "#6B7280", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />

          {/* Y Axis */}
          <YAxis
            tick={{ fill: "#6B7280", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />

          {/* Tooltip */}
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              border: "1px solid #E5E7EB",
              fontSize: "12px",
            }}
          />

          {/* Line */}
          <Line
            type="monotone"
            dataKey="value"
            stroke="var(--color-success)"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </ReLineChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default LineChart;