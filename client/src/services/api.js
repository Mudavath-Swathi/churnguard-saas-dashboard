import axios from "axios";

const api = axios.create({
  baseURL: "https://churnguard-saas-dashboard.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Attach JWT token automatically to every request
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;