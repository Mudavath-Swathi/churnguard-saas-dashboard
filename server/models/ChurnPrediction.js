// server/models/ChurnPrediction.js
import mongoose from "mongoose";

const churnPredictionSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      default: null, // bulk rows may not map to a customer
    },

    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },

    upload: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Upload",
      default: null,
    },

    rowIndex: {
      type: Number,
      default: null,
    },

    probability: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
    },

    riskLevel: {
      type: String,
      enum: ["low", "medium", "high"],
      required: true,
    },

    reasons: [String],
    recommendations: [String],

    modelVersion: {
      type: String,
      default: "v1",
    },

    source: {
      type: String,
      enum: ["mock", "ml"],
      default: "ml",
    },
  },
  { timestamps: true }
);

export default mongoose.model("ChurnPrediction", churnPredictionSchema);