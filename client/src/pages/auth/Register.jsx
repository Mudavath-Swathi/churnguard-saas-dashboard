import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../services/api";   
import { useAuth } from "../../hooks/useAuth.jsx";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [company, setCompany] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await api.post("/auth/register", {
        name,
        email,
        password,
        workspaceName: company,
      });

      console.log("REGISTER RESPONSE:", res.data);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      login(res.data.user);
      navigate("/");

    } catch (err) {
      console.error(err);
      setError("Registration failed");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >

      <div className="text-center mb-6">
        <h1 className="text-2xl font-semibold text-brand-dark">
          Create your workspace
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Start predicting churn in minutes
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company Name
          </label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
            className="w-full px-3 py-2 rounded-lg border border-default focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Your Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 rounded-lg border border-default focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Work Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 rounded-lg border border-default focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 rounded-lg border border-default focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <label className="flex items-start gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={agree}
            onChange={() => setAgree(!agree)}
            required
          />
          I agree to the{" "}
          <span className="text-green-700 font-medium">
            Terms & Privacy Policy
          </span>
        </label>

        <button
          type="submit"
          className="w-full bg-green-700 hover:bg-green-800 text-white py-2.5 rounded-lg font-medium"
        >
          Create Account
        </button>

      </form>

      <p className="text-center text-sm text-gray-600 mt-6">
        Already have an account?{" "}
        <Link to="/login" className="text-green-700 font-medium">
          Sign in
        </Link>
      </p>

    </motion.div>
  );
};

export default Register;