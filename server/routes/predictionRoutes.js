import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createPrediction,
  getPredictionsByCustomer,
  getPredictionSummary,
} from "../controllers/predictionController.js";

const router = express.Router();

/**
 * ✅ IMPORTANT:
 * Static routes MUST come before dynamic routes
 */

/**
 * @route   GET /api/predictions/summary
 * @desc    Get prediction summary (low / medium / high counts)
 * @access  Private
 */
router.get(
  "/summary",
  authMiddleware,
  getPredictionSummary
);

/**
 * @route   POST /api/predictions/:customerId
 * @desc    Create churn prediction using ML
 * @access  Private
 */
router.post(
  "/:customerId",
  authMiddleware,
  createPrediction
);

/**
 * @route   GET /api/predictions/:customerId
 * @desc    Get all churn predictions for a customer
 * @access  Private
 */
router.get(
  "/:customerId",
  authMiddleware,
  getPredictionsByCustomer
);

export default router;