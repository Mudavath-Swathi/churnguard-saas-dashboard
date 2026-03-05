// server/services/csvService.js
import fs from "fs";
import csv from "csv-parser";
import path from "path";
import { runPython } from "../utils/runPython.js";

const PREDICT_PY = path.join(process.cwd(), "server/ml/predict.py");
const EXPLAIN_PY = path.join(process.cwd(), "server/ml/explain.py");

export const processCSV = async (filePath) => {
  const rows = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => rows.push(data))
      .on("end", async () => {
        try {
          const results = [];

          for (let i = 0; i < rows.length; i++) {
            const row = rows[i];

            const mlInput = {
              tenure: Number(row.tenure),
              MonthlyCharges: Number(row.MonthlyCharges),
              TotalCharges: Number(row.TotalCharges),
              SeniorCitizen: Number(row.SeniorCitizen),
              PaperlessBilling_Yes:
                row.PaperlessBilling === "Yes" ? 1 : 0,
              "Contract_Month-to-month":
                row.Contract === "Month-to-month" ? 1 : 0,
            };

            const prediction = await runPython(PREDICT_PY, mlInput);
            const explanation = await runPython(EXPLAIN_PY, mlInput);

            results.push({
              rowIndex: i + 1,
              input: mlInput,
              prediction,
              explanation,
            });
          }

          resolve(results);
        } catch (err) {
          reject(err);
        }
      })
      .on("error", reject);
  });
};