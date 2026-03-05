import Upload from "../models/Upload.js";
import Workspace from "../models/Workspace.js";
import Customer from "../models/Customer.js";
import ChurnPrediction from "../models/ChurnPrediction.js";
import { processCSV } from "../services/csvService.js";

export const bulkPredict = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "CSV file required" });
    }

    /* 1️⃣ Workspace */
    const workspace = await Workspace.findOne({ owner: req.user._id });
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    /* 2️⃣ Create upload */
    const upload = await Upload.create({
      fileName: req.file.originalname,
      filePath: req.file.path,
      workspace: workspace._id,
      status: "processing",
      isActive: true,
    });

    /* 3️⃣ Run ML on CSV */
    const results = await processCSV(req.file.path);

    const savedPredictions = [];

    /* 4️⃣ Loop through rows */
    for (const r of results) {
      /* 🔹 Create Customer */
      const customer = await Customer.create({
        workspace: workspace._id,
        upload: upload._id,

        // Use CSV fields if available
        name: r.data?.customerID || `Customer ${r.rowIndex + 1}`,
        email: r.data?.email || "",

        tenure: r.data?.tenure,
        MonthlyCharges: r.data?.MonthlyCharges,
        TotalCharges: r.data?.TotalCharges,
        SeniorCitizen: r.data?.SeniorCitizen,
        Contract: r.data?.Contract,
        PaperlessBilling: r.data?.PaperlessBilling,

        churnRisk: r.prediction.probability,
      });

      /* 🔹 Create Prediction and LINK customer */
      const prediction = await ChurnPrediction.create({
        customer: customer._id,
        workspace: workspace._id,
        upload: upload._id,
        rowIndex: r.rowIndex,
        probability: r.prediction.probability,
        riskLevel: r.prediction.risk,
        reasons: r.explanation.reasons,
        recommendations: r.explanation.recommendations,
        source: "ml",
      });

      savedPredictions.push(prediction);
    }

    /* 5️⃣ Finalize upload */
    upload.status = "completed";
    upload.totalRecords = results.length;
    upload.successCount = savedPredictions.length;
    await upload.save();

    res.status(201).json({
      uploadId: upload._id,
      total: results.length,
      predictionsSaved: savedPredictions.length,
    });
  } catch (err) {
    console.error("Bulk prediction error:", err);
    res.status(500).json({ message: "Bulk prediction failed" });
  }
};