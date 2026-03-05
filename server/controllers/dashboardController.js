import ChurnPrediction from "../models/ChurnPrediction.js";
import Workspace from "../models/Workspace.js";
import { getLatestCompletedUpload } from "../services/upload.service.js";

/**
 * ================================
 * DASHBOARD SUMMARY
 * ================================
 */
export const getDashboardSummary = async (req, res) => {
  try {
    const workspace = await Workspace.findOne({ owner: req.user._id });
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    // 🔑 use only latest active upload
    const latestUpload = await getLatestCompletedUpload(workspace._id);

    if (!latestUpload) {
      return res.json({
        totalCustomers: 0,
        highRiskCustomers: 0,
        churnRate: 0,
        retentionRate: 0,
      });
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

    let total = 0;
    let high = 0;

    stats.forEach((item) => {
      total += item.count;
      if (item._id === "high") high = item.count;
    });

    const churnRate =
      total === 0 ? 0 : Number(((high / total) * 100).toFixed(1));

    res.json({
      totalCustomers: total,
      highRiskCustomers: high,
      churnRate,
      retentionRate: Number((100 - churnRate).toFixed(1)),
    });
  } catch (error) {
    console.error("Dashboard summary error:", error);
    res.status(500).json({ message: "Dashboard error" });
  }
};

/**
 * ================================
 * RISK DISTRIBUTION (PIE / BAR)
 * ================================
 */
export const getRiskDistribution = async (req, res) => {
  try {
    const workspace = await Workspace.findOne({ owner: req.user._id });
    if (!workspace) return res.json([]);

    const latestUpload = await getLatestCompletedUpload(workspace._id);
    if (!latestUpload) return res.json([]);

    const data = await ChurnPrediction.aggregate([
      {
        $match: {
          workspace: workspace._id,
          upload: latestUpload._id,
        },
      },
      {
        $group: {
          _id: "$riskLevel",
          value: { $sum: 1 },
        },
      },
    ]);

    res.json(data);
  } catch (err) {
    console.error("Risk distribution error:", err);
    res.status(500).json([]);
  }
};

export const getChurnTrends = async (req, res) => {
  try {
    const workspace = await Workspace.findOne({ owner: req.user._id });
    if (!workspace) return res.json([]);

    const latestUpload = await getLatestCompletedUpload(workspace._id);
    if (!latestUpload) return res.json([]);

    // total churn predictions
    const total = await ChurnPrediction.countDocuments({
      workspace: workspace._id,
      upload: latestUpload._id,
    });

    if (total === 0) return res.json([]);

    const DAYS = 7; // simulate last 7 days
    const today = new Date();
    let remaining = total;
    let cumulative = 0;

    const trend = [];

    for (let i = DAYS - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);

      // distribute churn gradually
      const daily = Math.floor(
        remaining / (i + 1)
      );

      cumulative += daily;
      remaining -= daily;

      trend.push({
        _id: date.toISOString().slice(0, 10), // YYYY-MM-DD
        value: cumulative,
      });
    }

    res.json(trend);
  } catch (err) {
    console.error("Churn trend error:", err);
    res.status(500).json([]);
  }
};

/**
 * ================================
 * MONTHLY RISK DISTRIBUTION
 * ================================
 */
export const getMonthlyRiskDistribution = async (req, res) => {
  try {
    const workspace = await Workspace.findOne({ owner: req.user._id });
    if (!workspace) return res.json([]);

    const latestUpload = await getLatestCompletedUpload(workspace._id);
    if (!latestUpload) return res.json([]);

    // total counts per risk
    const totals = await ChurnPrediction.aggregate([
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

    const riskTotals = { low: 0, medium: 0, high: 0 };
    totals.forEach((t) => {
      riskTotals[t._id] = t.count;
    });

    /**
     * Month weights (Jan → Dec)
     * Low at start, peak mid-year, slight dip end
     */
    const monthWeights = [
      0.6,  // Jan
      0.7,  // Feb
      0.8,  // Mar
      0.9,  // Apr
      1.0,  // May
      1.1,  // Jun
      1.15, // Jul
      1.2,  // Aug
      1.25, // Sep
      1.3,  // Oct
      1.1,  // Nov
      0.95, // Dec
    ];

    const baseLow = riskTotals.low / 12;
    const baseMedium = riskTotals.medium / 12;
    const baseHigh = riskTotals.high / 12;

    const months = monthWeights.map((weight, index) => {
      const random = () => Math.floor(Math.random() * 15); // small noise

      return {
        month: index + 1, // 1–12
        low: Math.max(0, Math.floor(baseLow * weight) + random()),
        medium: Math.max(0, Math.floor(baseMedium * weight) + random()),
        high: Math.max(0, Math.floor(baseHigh * weight) + random()),
      };
    });

    res.json(months);
  } catch (error) {
    console.error("Monthly risk distribution error:", error);
    res.status(500).json([]);
  }
};

/**
 * ================================
 * HIGH RISK CUSTOMERS
 * ================================
 */
export const getHighRiskCustomers = async (req, res) => {
  try {
    const workspace = await Workspace.findOne({ owner: req.user._id });
    if (!workspace) return res.json([]);

    const latestUpload = await getLatestCompletedUpload(workspace._id);
    if (!latestUpload) return res.json([]);

    const predictions = await ChurnPrediction.find({
      workspace: workspace._id,
      upload: latestUpload._id,
      riskLevel: "high",
    })
      .populate("customer", "name email")
      .sort({ probability: -1 })
      .limit(10);

    res.json(predictions);
  } catch (err) {
    console.error("High-risk error:", err);
    res.status(500).json([]);
  }
};