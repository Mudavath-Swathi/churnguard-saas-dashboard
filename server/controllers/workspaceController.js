import Workspace from "../models/Workspace.js";

/**
 * @desc    Create workspace
 * @route   POST /api/workspaces
 * @access  Private
 */
export const createWorkspace = async (req, res) => {
  try {
    const { name, plan } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Workspace name is required" });
    }

    // One workspace per user (SaaS rule)
    const existing = await Workspace.findOne({ owner: req.user._id });
    if (existing) {
      return res.status(400).json({ message: "Workspace already exists" });
    }

    const workspace = await Workspace.create({
      name,
      plan,
      owner: req.user._id,
    });

    res.status(201).json(workspace);
  } catch (error) {
    console.error("Create workspace error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc    Get current user's workspace
 * @route   GET /api/workspaces/me
 * @access  Private
 */
export const getMyWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findOne({ owner: req.user._id });

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    res.json(workspace);
  } catch (error) {
    console.error("Get workspace error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc    Get workspace by ID
 * @route   GET /api/workspaces/:id
 * @access  Private
 */
export const getWorkspaceById = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    // Ownership check
    if (workspace.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(workspace);
  } catch (error) {
    console.error("Get workspace by ID error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc    Update workspace
 * @route   PUT /api/workspaces/:id
 * @access  Private
 */
export const updateWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    if (workspace.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    workspace.name = req.body.name || workspace.name;
    workspace.plan = req.body.plan || workspace.plan;

    const updatedWorkspace = await workspace.save();
    res.json(updatedWorkspace);
  } catch (error) {
    console.error("Update workspace error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc    Delete workspace
 * @route   DELETE /api/workspaces/:id
 * @access  Private
 */
export const deleteWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    if (workspace.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await workspace.deleteOne();
    res.json({ message: "Workspace deleted successfully" });
  } catch (error) {
    console.error("Delete workspace error:", error);
    res.status(500).json({ message: "Server error" });
  }
};