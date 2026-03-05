import api from "./api";

/**
 * 🔹 Predictions summary (for cards)
 */
export const getPredictionSummary = async () => {
  try {
    const res = await api.get("/predictions/summary");
    return res.data;
  } catch (error) {
    console.error("Prediction summary API error:", error);
    return {
      high: 0,
      medium: 0,
      low: 0,
    };
  }
};

/**
 * 🔹 Predictions for a specific customer (drawer)
 */
export const getPredictionsByCustomer = async (customerId) => {
  try {
    const res = await api.get(`/predictions/${customerId}`);
    return res.data;
  } catch (error) {
    console.error("Customer prediction API error:", error);
    return [];
  }
};