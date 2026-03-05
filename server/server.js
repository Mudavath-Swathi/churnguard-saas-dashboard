import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";

import authRoutes from "./routes/authRoutes.js";
import workspaceRoutes from "./routes/workspaceRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import predictionRoutes from "./routes/predictionRoutes.js";
import bulkPredictionRoutes from "./routes/bulkPredictionRoutes.js";

import errorHandler from "./middleware/errorMiddleware.js"; 

const app = express();
const PORT = process.env.PORT || 3000;

await connectDB();

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/predictions", predictionRoutes);
app.use("/api/bulk-predictions", bulkPredictionRoutes);

app.get("/", (req, res) => res.send("Server is live..."));


app.use(errorHandler); 

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
