import express from "express";
import {
  createWorkspace,
  getMyWorkspace,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
} from "../controllers/workspaceController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createWorkspace);
router.get("/me", authMiddleware, getMyWorkspace);
router.get("/:id", authMiddleware, getWorkspaceById);
router.put("/:id", authMiddleware, updateWorkspace);
router.delete("/:id", authMiddleware, deleteWorkspace);

export default router;