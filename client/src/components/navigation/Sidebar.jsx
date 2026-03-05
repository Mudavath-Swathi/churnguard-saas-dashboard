import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Upload,
  LineChart,
  Users,
  BarChart3,
  Sparkles,
  Bell,
} from "lucide-react";

const Sidebar = () => {
  const navItem =
    "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition";

  return (
    <motion.aside
      initial={{ x: -32, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-60 bg-sidebar border-r border-default flex flex-col"
    >
      {/* ================= Logo ================= */}
      <div className="px-5 pt-5 pb-4 text-lg font-semibold text-brand-dark">
        ChurnGuard
      </div>

      {/* ================= Main Navigation ================= */}
      <nav className="flex flex-col gap-1 px-3">
        {[
          { to: "/", label: "Dashboard", icon: LayoutDashboard },
          { to: "/upload", label: "Upload Data", icon: Upload },
          { to: "/customers", label: "Customers", icon: Users },
          { to: "/predictions", label: "Predictions", icon: LineChart },
          { to: "/insights", label: "Insights", icon: BarChart3 },
        ].map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} end>
            {({ isActive }) => (
              <motion.div
                whileHover={{ x: 4 }}
                className={`${navItem} ${
                  isActive
                    ? "bg-sidebar-active text-brand-dark"
                    : "text-brand-dark hover:bg-[var(--green-50)]"
                }`}
              >
                <Icon size={18} className="icon-brand" />
                {label}
              </motion.div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ================= Divider ================= */}
      <div className="my-4 mx-5 border-t border-default" />

      {/* ================= Roadmap ================= */}
      <div className="flex flex-col gap-1 px-3">
        <div className="flex items-center gap-3 px-4 py-2 text-sm text-gray-400">
          <Sparkles size={16} />
          Segmentation
          <span className="ml-auto text-xs bg-gray-200 px-2 py-0.5 rounded">
            Beta
          </span>
        </div>

        <div className="flex items-center gap-3 px-4 py-2 text-sm text-gray-400">
          <Bell size={16} />
          Alerts
          <span className="ml-auto text-xs bg-gray-200 px-2 py-0.5 rounded">
            Soon
          </span>
        </div>
      </div>

      {/* Push content up */}
      <div className="flex-1" />

      {/* ================= Upgrade Card ================= */}
      <div className="px-4 pb-6">
        <div className="rounded-xl bg-[var(--green-900)] text-white p-4">
          <p className="text-sm font-semibold">Upgrade Plan</p>
          <p className="text-xs text-white/80 mt-1">
            Unlock exports & advanced insights
          </p>

          <button className="mt-3 w-full bg-highlight text-brand-dark text-sm py-2 rounded-lg font-medium">
            Get Pro
          </button>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;