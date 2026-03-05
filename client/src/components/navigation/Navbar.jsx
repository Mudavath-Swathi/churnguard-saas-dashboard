import { motion } from "framer-motion";
import { Search, ChevronDown } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

/* Route → Title mapping */
const titles = {
  "/": "Dashboard",
  "/upload": "Upload Data",
  "/customers": "Customers",
  "/predictions": "Predictions",
  "/insights": "Insights",
};

const Navbar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const title = titles[pathname] || "Dashboard";
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();          // clear auth + localStorage
    setOpen(false);    // close dropdown
    navigate("/login"); // go to login page
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-14 bg-white border-b border-default flex items-center justify-between px-6"
    >
      {/* Left: Page Title */}
      <h2 className="text-sm font-semibold text-brand-dark">
        {title}
      </h2>

      {/* Right: Controls */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search
            size={16}
            className="absolute left-3 top-2.5 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search…"
            className="pl-9 pr-3 py-1.5 text-sm rounded-lg border border-default bg-white focus:outline-none focus:ring-1 focus:ring-[var(--green-300)]"
          />
        </div>

        {/* Date Filter */}
        <select className="text-sm border border-default rounded-lg px-3 py-1.5 bg-white">
          <option>This Month</option>
          <option>This Quarter</option>
          <option>This Year</option>
        </select>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2"
          >
            <div className="h-8 w-8 rounded-full bg-[var(--green-300)] flex items-center justify-center text-sm font-medium text-brand-dark">
              S
            </div>
            <ChevronDown size={14} className="text-gray-500" />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-default rounded-lg shadow-sm overflow-hidden z-50">
              <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">
                Profile
              </button>
              <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">
                Settings
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;