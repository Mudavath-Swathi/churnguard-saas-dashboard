import api from "./api";

/**
 * Pie chart: risk distribution
 */
export const getRiskDistribution = async () => {
  const res = await api.get("/dashboard/risk-distribution");
  return res.data;
};

/**
 * Bar chart: monthly risk distribution
 */
export const getMonthlyRiskDistribution = async () => {
  
  const res = await api.get("/dashboard/monthly-risk-distribution");
  return res.data;
};