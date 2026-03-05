import User from "../models/User.js";
import Workspace from "../models/Workspace.js";
import generateToken from "../utils/generateToken.js";

export const register = async (req, res) => {
  try {
    const { name, email, password, workspaceName } = req.body;

    if (!name || !email || !password || !workspaceName) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    // create user first
    const user = await User.create({
      name,
      email,
      password
    });

    // create workspace with owner
    const workspace = await Workspace.create({
      name: workspaceName,
      owner: user._id
    });

    // attach workspace to user
    user.workspace = workspace._id;
    await user.save();

    res.status(201).json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};