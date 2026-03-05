import Upload from "../models/Upload.js";
import Workspace from "../models/Workspace.js";
import { runPredictionForUpload } from "../services/prediction.service.js";

export const uploadCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "CSV file is required" });
    }

    const workspace = await Workspace.findOne({ owner: req.user._id });
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    const upload = await Upload.create({
      fileName: req.file.originalname,
      storedName: req.file.filename,
      filePath: req.file.path,
      workspace: workspace._id,
      status: "pending",
    });

    // ✅ PASS upload._id (NOT upload object)
    runPredictionForUpload(upload._id).catch((err) =>
      console.error("Prediction error:", err)
    );

    res.status(201).json({
      message: "File uploaded successfully",
      uploadId: upload._id,
      status: "processing",
    });
  } catch (error) {
    console.error("Upload CSV error:", error);
    res.status(500).json({ message: "Server error" });
  }
};