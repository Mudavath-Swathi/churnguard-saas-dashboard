import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth.jsx"

import AuthLayout from "./layouts/AuthLayout";
import DashboardLayout from "./layouts/DashboardLayout";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register"
import Dashboard from "./pages/dashboard/Dashboard";
import UploadData from "./pages/dashboard/UploadData";
import Predictions from "./pages/dashboard/Predictions";
import Customers from "./pages/dashboard/Customers";
import Insights from "./pages/dashboard/Insights";

const App = () => {
   const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Auth */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>


      {/* PROTECTED DASHBOARD */}
      <Route
        element={
          isAuthenticated ? (
            <DashboardLayout />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      >


      
        <Route path="/" element={<Dashboard />} />
        <Route path="/upload" element={<UploadData />} />
        <Route path="/predictions" element={<Predictions />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/insights" element={<Insights />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;