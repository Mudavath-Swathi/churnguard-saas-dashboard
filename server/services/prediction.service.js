import fs from "fs";
import csv from "csv-parser";
import Upload from "../models/Upload.js";
import Customer from "../models/Customer.js";
import ChurnPrediction from "../models/ChurnPrediction.js";

export const runPredictionForUpload = async (uploadId) => {
  const upload = await Upload.findById(uploadId);
  if (!upload) return;

  /* 🔥 0️⃣ HARD RESET for this upload */
  await Customer.deleteMany({
    workspace: upload.workspace,
    upload: upload._id,
  });

  await ChurnPrediction.deleteMany({
    workspace: upload.workspace,
    upload: upload._id,
  });

  const customersToInsert = [];
  const predictionsToInsert = [];
  let index = 0;

  fs.createReadStream(upload.filePath)
    .pipe(csv())
    .on("data", (row) => {
      index++;

      const tenure = Number(row.tenure) || 0;
      const monthlyCharges = Number(row.MonthlyCharges) || 0;

      customersToInsert.push({
        name: row.customerID || `Customer-${index}`,
        email: row.customerID ? `${row.customerID}@dummy.com` : null,
        workspace: upload.workspace,
        upload: upload._id,

        tenure,
        MonthlyCharges: monthlyCharges,
        TotalCharges: Number(row.TotalCharges) || 0,
        SeniorCitizen: Number(row.SeniorCitizen) || 0,

        Contract: row.Contract,
        PaperlessBilling: row.PaperlessBilling,
      });
    })
    .on("end", async () => {
      try {
        /* 1️⃣ Insert customers */
        const customers = await Customer.insertMany(customersToInsert);

        /* 2️⃣ Generate predictions */
        customers.forEach((customer) => {
          let riskLevel = "low";
          let probability = 0.15;

          if (customer.tenure < 6 || customer.MonthlyCharges > 80) {
            riskLevel = "high";
            probability = 0.8;
          } else if (customer.tenure < 18 || customer.MonthlyCharges > 60) {
            riskLevel = "medium";
            probability = 0.5;
          }

          predictionsToInsert.push({
            customer: customer._id,
            workspace: upload.workspace,
            upload: upload._id,
            probability,
            riskLevel,
            source: "ml",
          });

          /* 🔑 sync customer churnRisk */
          customer.churnRisk = probability;
        });

        await ChurnPrediction.insertMany(predictionsToInsert);
        await Customer.bulkSave(customers);

        /* 3️⃣ Activate upload */
        await Upload.findByIdAndUpdate(upload._id, {
          status: "completed",
          isActive: true,
          totalRecords: index,
          successCount: customers.length,
          failedCount: index - customers.length,
        });

        /* 4️⃣ Deactivate previous uploads */
        await Upload.updateMany(
          {
            workspace: upload.workspace,
            _id: { $ne: upload._id },
          },
          { isActive: false }
        );

        console.log("✅ Predictions done. Dashboard data consistent.");
      } catch (err) {
        console.error("❌ Prediction failed:", err);
        await Upload.findByIdAndUpdate(upload._id, {
          status: "failed",
          errorMessage: err.message,
        });
      }
    })
    .on("error", async (err) => {
      console.error("CSV read error:", err);
      await Upload.findByIdAndUpdate(upload._id, {
        status: "failed",
        errorMessage: err.message,
      });
    });
};