import api from "./api";

/**
 * Register user
 */
export const registerUser = async (data) => {
  const response = await api.post("/auth/register", data);

  
  localStorage.setItem("token", response.data.token);
  localStorage.setItem("user", JSON.stringify(response.data.user));

  return response.data;
};

/**
 * Login user
 */
export const loginUser = async (data) => {
  const response = await api.post("/auth/login", data);

  
  localStorage.setItem("token", response.data.token);
  localStorage.setItem("user", JSON.stringify(response.data.user));

  return response.data;
};

/**
 * Logout
 */
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};