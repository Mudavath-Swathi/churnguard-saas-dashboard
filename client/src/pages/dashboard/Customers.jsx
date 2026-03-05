import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter } from "lucide-react";
import CustomerDrawer from "../../components/customers/CustomerDrawer";
import { getCustomersWithChurn } from "../../services/customer.service";


const riskBadge = {
  low: "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-red-100 text-red-700",
};

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  
  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const data = await getCustomersWithChurn();
        setCustomers(data);
      } catch (err) {
        console.error("Load customers error:", err);
      }
    };

    loadCustomers();
  }, []);

  
  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());

    const matchesRisk =
      riskFilter === "All"
        ? true
        : c.risk === riskFilter.toLowerCase();

    return matchesSearch && matchesRisk;
  });

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-brand-dark">
            Customers
          </h1>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search customer"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 border border-default rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[var(--green-300)]"
            />
          </div>

          {/* Risk Filter */}
          <div className="relative">
            <Filter
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="pl-9 pr-8 py-2 border border-default rounded-lg text-sm focus:outline-none"
            >
              <option value="All">All Risks</option>
              <option value="Low">Low Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="High">High Risk</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="card p-0 overflow-hidden h-[calc(100vh-220px)]">
          <div className="overflow-y-auto max-h-full">
          <table className="w-full text-sm">
            <thead className="bg-soft text-gray-600 sticky top-0 z-10">
              <tr>
                <th className="text-left px-4 py-3 font-medium">
                  Customer
                </th>
                <th className="text-left px-4 py-3 font-medium">
                  Plan
                </th>
                <th className="text-left px-4 py-3 font-medium">
                  Risk
                </th>
                <th className="text-left px-4 py-3 font-medium">
                  Churn Score
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  onClick={() => {
                    setSelectedCustomer(customer);
                    setDrawerOpen(true);
                  }}
                  className="cursor-pointer hover:bg-[var(--green-50)] transition"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-brand-dark">
                      {customer.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {customer.email}
                    </p>
                  </td>

                  <td className="px-4 py-3">
                    —
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        riskBadge[customer.risk]
                      }`}
                    >
                      {customer.risk.charAt(0).toUpperCase() +
                        customer.risk.slice(1)}{" "}
                      Risk
                    </span>
                  </td>

                  <td className="px-4 py-3 font-medium">
                    {customer.churnScore}%
                  </td>
                </tr>
              ))}

              {filteredCustomers.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-6 text-gray-500"
                  >
                    No customers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        </div>
      </motion.div>

      {/* Drawer */}
      <CustomerDrawer
        open={drawerOpen}
        customer={selectedCustomer}
        onClose={() => setDrawerOpen(false)}
      />
    </>
  );
};

export default Customers;