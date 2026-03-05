import path from "path";
import { fileURLToPath } from "url";

import ChurnPrediction from "../models/ChurnPrediction.js";
import Customer from "../models/Customer.js";
import Workspace from "../models/Workspace.js";
import { runPython } from "../utils/runPython.js";
import { getLatestCompletedUpload } from "../services/upload.service.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ML scripts
const PREDICT_PY = path.join(__dirname, "../ml/predict.py");
const EXPLAIN_PY = path.join(__dirname, "../ml/explain.py");

/**
 * @route POST /api/predictions/:customerId
 * @access Private
 */
export const createPrediction = async (req, res) => {
  try {
    const { customerId } = req.params;

    /* 1️⃣ Validate customer */
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    /* 2️⃣ Validate workspace */
    const workspace = await Workspace.findOne({ owner: req.user._id });
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    if (customer.workspace.toString() !== workspace._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    /* 3️⃣ Prepare ML input (MATCH feature_columns.json) */
    const mlInput = {
      tenure: customer.tenure,
      MonthlyCharges: customer.monthlyCharges,
      TotalCharges: customer.totalCharges,
      SeniorCitizen: customer.seniorCitizen ? 1 : 0,
      PaperlessBilling_Yes: customer.paperlessBilling ? 1 : 0,
      "Contract_Month-to-month":
        customer.contract === "Month-to-month" ? 1 : 0,
    };

    /* 4️⃣ Run ML */
    const prediction = await runPython(PREDICT_PY, mlInput);
    const explanation = await runPython(EXPLAIN_PY, mlInput);

    /* 5️⃣ Save prediction */
    const savedPrediction = await ChurnPrediction.create({
      customer: customer._id,
      workspace: workspace._id,
      probability: prediction.probability,
      riskLevel: prediction.risk,
      reasons: explanation.reasons,
      recommendations: explanation.recommendations,
      source: "ml",
    });

    res.status(201).json({
      prediction: savedPrediction,
      ml: explanation,
    });
  } catch (error) {
    console.error("ML prediction error:", error);
    res.status(500).json({ message: "ML prediction failed" });
  }
};

/**
 * @route GET /api/predictions/:customerId
 * @access Private
 */
export const getPredictionsByCustomer = async (req, res) => {
  try {
    const predictions = await ChurnPrediction.find({
      customer: req.params.customerId,
    }).sort({ createdAt: -1 });

    res.json(predictions);
  } catch (error) {
    console.error("Get predictions error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ================================
 * PREDICTION SUMMARY (for UI cards)
 * ================================
 * @route GET /api/predictions/summary
 * @access Private
 */
export const getPredictionSummary = async (req, res) => {
  try {
    const workspace = await Workspace.findOne({ owner: req.user._id });
    if (!workspace) return res.json({ high: 0, medium: 0, low: 0 });

    const latestUpload = await getLatestCompletedUpload(workspace._id);
    if (!latestUpload) {
      return res.json({ high: 0, medium: 0, low: 0 });
    }

    const stats = await ChurnPrediction.aggregate([
      {
        $match: {
          workspace: workspace._id,
          upload: latestUpload._id,
        },
      },
      {
        $group: {
          _id: "$riskLevel",
          count: { $sum: 1 },
        },
      },
    ]);

    const summary = { high: 0, medium: 0, low: 0 };

    stats.forEach((item) => {
      summary[item._id] = item.count;
    });

    res.json(summary);
  } catch (error) {
    console.error("Prediction summary error:", error);
    res.status(500).json({ message: "Failed to load prediction summary" });
  }
};