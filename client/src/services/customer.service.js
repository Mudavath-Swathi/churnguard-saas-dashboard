import api from "./api";

export const getCustomersWithChurn = async () => {
  const res = await api.get("/customers/churn");
  return res.data;
};