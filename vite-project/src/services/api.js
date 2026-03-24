import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // this sends cookies automatically with every request
});

// Handle responses
api.interceptors.response.use(
  (res) => res,
  (err) => {
    // If 401, redirect to login
    if (err.response?.status === 401) {
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;