import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import uploadMiddleware from "../middleware/uploadMiddleware.js";
import { uploadCSV } from "../controllers/uploadController.js";

const router = express.Router();

/**
 * @route   POST /api/uploads
 * @desc    Upload CSV file
 * @access  Private
 */
router.post(
  "/",
  authMiddleware,
  uploadMiddleware.single("file"),
  uploadCSV
);

export default router;
