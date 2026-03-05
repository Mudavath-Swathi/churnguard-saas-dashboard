import {
  ResponsiveContainer,
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useEffect, useState } from "react";
import { getMonthlyRiskDistribution } from "../../services/dashboard.service";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const BarChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const loadMonthlyRisk = async () => {
      try {
        const res = await getMonthlyRiskDistribution();

        // Map backend result by month number (1–12)
        const backendMap = {};
        res.forEach((item) => {
          backendMap[item.month] = item;
        });

        // HYBRID: always show Jan–Dec
        const fullData = MONTHS.map((label, index) => {
          const monthNumber = index + 1;
          const backendMonth = backendMap[monthNumber] || {};

          return {
            month: label,
            low: backendMonth.low ?? 0,
            medium: backendMonth.medium ?? 0,
            high: backendMonth.high ?? 0,
          };
        });

        setData(fullData);
      } catch (error) {
        console.error("Monthly risk chart error:", error);
      }
    };

    loadMonthlyRisk();
  }, []);

  return (
    <div className="h-[160px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ReBarChart
          data={data}
          barCategoryGap={24}
          barGap={6}
        >
          {/* Grid */}
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--color-border)"
            vertical={false}
          />

          {/* X Axis */}
          <XAxis
            dataKey="month"
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
            domain={[0, "dataMax + 200"]}
          />

          {/* Tooltip */}
          <Tooltip
            formatter={(value, name) => [
              value,
              name === "low"
                ? "Low Risk"
                : name === "medium"
                ? "Medium Risk"
                : "High Risk",
            ]}
            contentStyle={{
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              border: "1px solid #E5E7EB",
              fontSize: "12px",
            }}
          />

          {/* Legend */}
          <Legend
            verticalAlign="top"
            height={24}
            formatter={(value) =>
              value === "low"
                ? "Low Risk"
                : value === "medium"
                ? "Medium Risk"
                : "High Risk"
            }
          />

          {/* Bars */}
          <Bar
            dataKey="low"
            fill="var(--color-success)"
            radius={[6, 6, 0, 0]}
          />
          <Bar
            dataKey="medium"
            fill="var(--color-warning)"
            radius={[6, 6, 0, 0]}
          />
          <Bar
            dataKey="high"
            fill="var(--color-danger)"
            radius={[6, 6, 0, 0]}
          />
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;