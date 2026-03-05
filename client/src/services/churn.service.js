import api from "./api";

/* ================= Dashboard Summary ================= */
export const getDashboardSummary = async () => {
  const res = await api.get("/dashboard/summary");
  return res.data;
};

/* ================= Risk Distribution (Pie) ================= */
export const getRiskDistribution = async () => {
  const res = await api.get("/dashboard/risk-distribution");
  return res.data;
};

/* ================= Trends (Bar / Line) ================= */
export const getChurnTrends = async () => {
  const res = await api.get("/dashboard/trends");
  return res.data;
};