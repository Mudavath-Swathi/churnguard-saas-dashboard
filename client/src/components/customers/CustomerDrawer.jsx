import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { getPredictionsByCustomer } from "../../services/prediction.service";

const riskBadge = {
  low: "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-red-100 text-red-700",
};

const CustomerDrawer = ({ open, customer, onClose }) => {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !customer?.id) return;

    const loadPrediction = async () => {
      setLoading(true);
      try {
        const res = await getPredictionsByCustomer(customer.id);

        // Take latest prediction
        if (res && res.length > 0) {
          setPrediction(res[0]);
        } else {
          setPrediction(null);
        }
      } catch (err) {
        console.error("Load customer prediction error:", err);
        setPrediction(null);
      } finally {
        setLoading(false);
      }
    };

    loadPrediction();
  }, [open, customer]);

  if (!customer) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/30 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed right-0 top-0 h-screen w-[380px] bg-white z-50 shadow-xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h2 className="text-lg font-semibold text-brand-dark">
                Customer Details
              </h2>
              <button onClick={onClose}>
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-sm">
              {/* Name + Email */}
              <div>
                <p className="font-medium">{customer.name}</p>
                <p className="text-gray-500">{customer.email}</p>
              </div>

              {/* Risk */}
              <div>
                <p className="text-gray-500">Risk Level</p>
                <span
                  className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                    riskBadge[customer.risk]
                  }`}
                >
                  {customer.risk.charAt(0).toUpperCase() +
                    customer.risk.slice(1)}{" "}
                  Risk
                </span>
              </div>

              {/* Churn Score */}
              <div>
                <p className="text-gray-500">Churn Probability</p>
                <p className="text-xl font-semibold">
                  {customer.churnScore}%
                </p>
              </div>

              {/* Reasons */}
              <div>
                <p className="text-gray-500">
                  Why this customer is at risk
                </p>

                {loading ? (
                  <p className="mt-1 text-gray-500">Loading insights…</p>
                ) : prediction?.reasons?.length > 0 ? (
                  <ul className="mt-2 list-disc list-inside text-gray-700 space-y-1">
                    {prediction.reasons.map((reason, index) => (
                      <li key={index}>{reason}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-1 text-gray-600">
                    Risk identified based on usage and billing patterns.
                  </p>
                )}
              </div>

              {/* Recommendations */}
              {prediction?.recommendations?.length > 0 && (
                <div>
                  <p className="text-gray-500">
                    Recommended Actions
                  </p>
                  <ul className="mt-2 list-disc list-inside text-gray-700 space-y-1">
                    {prediction.recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t">
              <button className="w-full bg-[var(--green-700)] text-white py-2 rounded-lg text-sm font-medium">
                Take Action
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default CustomerDrawer;