import path from "path";
import { fileURLToPath } from "url";

import Customer from "../models/Customer.js";
import ChurnPrediction from "../models/ChurnPrediction.js";
import { runPython } from "../utils/runPython.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PREDICT_PY = path.join(__dirname, "../ml/predict.py");
const EXPLAIN_PY = path.join(__dirname, "../ml/explain.py");

export const runAutoPredictionsForUpload = async (upload) => {
  const customers = await Customer.find({
    workspace: upload.workspace,
    upload: upload._id,
  });

  for (const customer of customers) {
    // ⛔ Skip if already predicted
    const exists = await ChurnPrediction.findOne({
      customer: customer._id,
      upload: upload._id,
    });

    if (exists) continue;

    const mlInput = {
      tenure: customer.tenure,
      MonthlyCharges: customer.MonthlyCharges,
      TotalCharges: customer.TotalCharges,
      SeniorCitizen: customer.SeniorCitizen,
      PaperlessBilling_Yes:
        customer.PaperlessBilling === "Yes" ? 1 : 0,
      "Contract_Month-to-month":
        customer.Contract === "Month-to-month" ? 1 : 0,
    };

    const prediction = await runPython(PREDICT_PY, mlInput);
    const explanation = await runPython(EXPLAIN_PY, mlInput);

    await ChurnPrediction.create({
      customer: customer._id,
      workspace: upload.workspace,
      upload: upload._id,
      rowIndex: customer.rowIndex,
      probability: prediction.probability,
      riskLevel: prediction.risk,
      reasons: explanation.reasons,
      recommendations: explanation.recommendations,
      source: "ml",
    });
  }
};