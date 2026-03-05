import Customer from "../models/Customer.js";
import Workspace from "../models/Workspace.js";
import ChurnPrediction from "../models/ChurnPrediction.js";
import { getLatestCompletedUpload } from "../services/upload.service.js";

export const getCustomersWithChurn = async (req, res) => {
  try {
    const workspace = await Workspace.findOne({ owner: req.user._id });
    if (!workspace) return res.json([]);

    const latestUpload = await getLatestCompletedUpload(workspace._id);
    if (!latestUpload) return res.json([]);

    const predictions = await ChurnPrediction.find({
      workspace: workspace._id,
      upload: latestUpload._id,
    })
      .populate("customer", "name email")
      .sort({ probability: -1 });

    const result = predictions.map((p) => ({
      id: p.customer?._id,
      name: p.customer?.name || "Unknown",
      email: p.customer?.email || "-",
      risk: p.riskLevel,              // low | medium | high
      churnScore: Math.round(p.probability * 100),
      reasons: p.reasons,
      recommendations: p.recommendations,
    }));

    res.json(result);
  } catch (error) {
    console.error("Customer churn view error:", error);
    res.status(500).json([]);
  }
};

export const createCustomer = async (req, res) => {
  try {
    const { name, email, plan } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Customer name is required" });
    }

    const workspace = await Workspace.findOne({ owner: req.user._id });
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    const customer = await Customer.create({
      name,
      email,
      plan,
      workspace: workspace._id,
    });

    res.status(201).json(customer);
  } catch (error) {
    console.error("Create customer error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc    Get all customers of workspace
 * @route   GET /api/customers
 * @access  Private
 */
export const getCustomers = async (req, res) => {
  try {
    const workspace = await Workspace.findOne({ owner: req.user._id });
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    const customers = await Customer.find({ workspace: workspace._id });
    res.json(customers);
  } catch (error) {
    console.error("Get customers error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc    Get single customer
 * @route   GET /api/customers/:id
 * @access  Private
 */
export const getCustomerById = async (req, res) => {
  try {
    const workspace = await Workspace.findOne({ owner: req.user._id });
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    const customer = await Customer.findOne({
      _id: req.params.id,
      workspace: workspace._id,
    });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json(customer);
  } catch (error) {
    console.error("Get customer error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc    Update customer
 * @route   PUT /api/customers/:id
 * @access  Private
 */
export const updateCustomer = async (req, res) => {
  try {
    const workspace = await Workspace.findOne({ owner: req.user._id });
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    const customer = await Customer.findOne({
      _id: req.params.id,
      workspace: workspace._id,
    });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    if (req.body.name) customer.name = req.body.name;
    if (req.body.email) customer.email = req.body.email;
    if (req.body.plan) customer.plan = req.body.plan;

    const updatedCustomer = await customer.save();
    res.json(updatedCustomer);
  } catch (error) {
    console.error("Update customer error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc    Delete customer
 * @route   DELETE /api/customers/:id
 * @access  Private
 */
export const deleteCustomer = async (req, res) => {
  try {
    const workspace = await Workspace.findOne({ owner: req.user._id });
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    const customer = await Customer.findOne({
      _id: req.params.id,
      workspace: workspace._id,
    });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    await customer.deleteOne();
    res.json({ message: "Customer deleted successfully" });
  } catch (error) {
    console.error("Delete customer error:", error);
    res.status(500).json({ message: "Server error" });
  }
};