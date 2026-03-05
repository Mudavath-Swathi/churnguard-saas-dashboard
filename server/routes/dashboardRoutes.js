import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getDashboardSummary,
  getRiskDistribution,
  getChurnTrends,
  getHighRiskCustomers,getMonthlyRiskDistribution
} from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/summary", authMiddleware, getDashboardSummary);
router.get("/risk-distribution", authMiddleware, getRiskDistribution);
router.get("/trends", authMiddleware, getChurnTrends);
router.get("/high-risk", authMiddleware, getHighRiskCustomers);
router.get("/monthly-risk-distribution", authMiddleware, getMonthlyRiskDistribution);

export default router;