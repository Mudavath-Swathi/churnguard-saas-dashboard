import { Outlet } from "react-router-dom";
import Sidebar from "../components/navigation/Sidebar";
import Navbar from "../components/navigation/Navbar";

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-[var(--color-bg)]">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="flex-1 px-6 py-4 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <Outlet/>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;