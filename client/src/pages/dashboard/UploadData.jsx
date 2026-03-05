import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, X } from "lucide-react";
import Papa from "papaparse";
import { uploadCSV } from "../../services/upload.service";

const UploadData = () => {
  const [fileName, setFileName] = useState("");
  const [rows, setRows] = useState([]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);

    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setRows(results.data.slice(0, 5));
      },
    });

    
    try {
      const res = await uploadCSV(file);
      console.log("Upload success:", res);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  const resetUpload = () => {
    setFileName("");
    setRows([]);
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-brand-dark">
          Upload Customer Data
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Upload CSV files to analyze customer churn risk
        </p>
      </div>

      {/* Upload Card */}
      <div className="card">
        {!fileName ? (
          <label className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-default rounded-xl py-10 cursor-pointer hover:bg-[var(--green-50)] transition">
            <Upload size={28} className="text-brand" />
            <p className="text-sm font-medium text-brand-dark">
              Click to upload CSV file
            </p>
            <p className="text-xs text-gray-500">
              Supported format: .csv
            </p>
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText size={20} className="text-brand" />
              <div>
                <p className="text-sm font-medium text-brand-dark">
                  {fileName}
                </p>
                <p className="text-xs text-gray-500">
                  Previewing first 5 rows
                </p>
              </div>
            </div>

            <button
              onClick={resetUpload}
              className="text-gray-400 hover:text-red-600"
            >
              <X size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Preview Table */}
      {rows.length > 0 && (
        <div className="card overflow-x-auto">
          <p className="text-sm font-semibold text-brand-dark mb-3">
            Data Preview
          </p>

          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-default text-left">
                {Object.keys(rows[0]).map((key) => (
                  <th
                    key={key}
                    className="py-2 pr-4 text-gray-500 font-medium"
                  >
                    {key}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {rows.map((row, idx) => (
                <tr
                  key={idx}
                  className="border-b border-default last:border-0"
                >
                  {Object.values(row).map((value, i) => (
                    <td key={i} className="py-2 pr-4 text-gray-700">
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Info */}
      <div className="text-xs text-gray-500">
        Uploaded data will be used to generate churn predictions,
        customer segments, and actionable insights.
      </div>
    </motion.div>
  );
};

export default UploadData;