import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import StatCard from "../../components/cards/StatCard";
import LineChart from "../../components/charts/LineChart";
import BarChart from "../../components/charts/BarChart";
import PieChart from "../../components/charts/PieChart";
import { getDashboardSummary } from "../../services/churn.service";

const Dashboard = () => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const data = await getDashboardSummary();
        setSummary(data);
      } catch (err) {
        console.error("Dashboard summary error", err);
      }
    };

    loadSummary();
  }, []);

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* ================= Stats Section ================= */}
      <div className="space-y-4">
        <p className="section-title font-medium text-sm">
          Churn Overview
        </p>

        <div className="grid grid-cols-1 sm:grd-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
          title="High Risk Customers"
          value={summary?.highRiskCustomers ?? 0}
          trend=""
          type="danger"
          />

           <StatCard
           title="Total Customers"
           value={summary?.totalCustomers ?? 0}
           trend=""
           type="success"
           />

          <StatCard
          title="Churn Rate"
          value={`${summary?.churnRate ?? 0}%`}
          trend=""
          type="warning"
          />

          <StatCard
          title="Retention Rate"
          value={`${summary?.retentionRate ?? 0}%`}
          trend=""
          type="success"
          />
        </div>
      </div>

      {/* ================= Charts ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="card lg:col-span-2 h-[240px]">
          <p className="section-title mb-2">Churn Trend</p>
          <LineChart />
        </div>

        <div className="card h-[240px]">
          <p className="section-title mb-2">Customer Segments</p>
          <PieChart />
        </div>
      </div>

      <div className="card mt-5 h-[220px]">
        <p className="section-title mb-2">Monthly Risk Distribution</p>
        <BarChart />
      </div>
    </motion.div>
  );
};

export default Dashboard;