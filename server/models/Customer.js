import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },

    upload: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Upload",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    // =====================
    // FEATURES FROM CSV
    // =====================
    tenure: Number,
    MonthlyCharges: Number,
    TotalCharges: Number,
    SeniorCitizen: Number,

    Contract: String,
    PaperlessBilling: String,

    // =====================
    // DERIVED
    // =====================
    churnRisk: {
      type: Number,
      min: 0,
      max: 1,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Customer", customerSchema);