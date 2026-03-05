import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import uploadMiddleware from "../middleware/uploadMiddleware.js";
import { bulkPredict } from "../controllers/bulkPredictionController.js";

const router = express.Router();

router.post(
  "/bulk",
  authMiddleware,
  uploadMiddleware.single("file"),
  bulkPredict
);

export default router;