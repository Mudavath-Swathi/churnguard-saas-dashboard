import axios from "axios";

export const getChurnPrediction = async (customers) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/predict",
      { customers }
    );

    return response.data;
  } catch (error) {
    console.error("ML service error:", error.message);
    return [];
  }
};