import express from "express";
import {
  createCustomer,
  getCustomersWithChurn,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} from "../controllers/customerController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { get } from "mongoose";

const router = express.Router();

// All customer routes are protected
router.use(authMiddleware);

/**
 * @route   POST /api/customers
 * @desc    Create customer
 */
router.post("/", createCustomer);

router.get("/churn", getCustomersWithChurn); // New route for churn view data

/**
 * @route   GET /api/customers
 * @desc    Get all customers of logged-in user's workspace
 */
router.get("/", getCustomers);

/**
 * @route   GET /api/customers/:id
 * @desc    Get single customer
 */
router.get("/:id", getCustomerById);

/**
 * @route   PUT /api/customers/:id
 * @desc    Update customer
 */
router.put("/:id", updateCustomer);

/**
 * @route   DELETE /api/customers/:id
 * @desc    Delete customer
 */
router.delete("/:id", deleteCustomer);

export default router;