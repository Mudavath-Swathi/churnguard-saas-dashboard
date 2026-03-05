import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    

    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/login",
        { email, password }
      );

      console.log("LOGIN RESPONSE", res.data);

      
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      
      login(res.data.user);

      navigate("/");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Brand */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-semibold text-brand-dark">
          ChurnGuard
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Sign in to your workspace
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Work Email
          </label>
          <input
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 rounded-lg border border-default focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 rounded-lg border border-default focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        {/* Remember + Forgot */}
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-gray-600">
            <input
              type="checkbox"
              checked={remember}
              onChange={() => setRemember(!remember)}
              className="rounded border-gray-300"
            />
            Remember me
          </label>

          <button
            type="button"
            className="text-green-700 font-medium hover:underline"
          >
            Forgot password?
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-green-700 hover:bg-green-800 text-white py-2.5 rounded-lg font-medium transition"
        >
          Sign In
        </button>
      </form>

      {/* Footer */}
      <p className="text-center text-sm text-gray-600 mt-6">
        Don’t have an account?{" "}
        <Link
          to="/register"
          className="text-green-700 font-medium hover:underline"
        >
          Create workspace
        </Link>
      </p>
    </motion.div>
  );
};

export default Login;