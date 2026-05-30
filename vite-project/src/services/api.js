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
    const url = err.config?.url ?? "";
    const status = err.response?.status;

    // 401 (no/invalid token) → redirect to login, but not for /auth/me (session restore)
    if (status === 401 && !url.includes("/auth/me")) {
      window.location.href = "/login";
    }

    // 403 (wrong role) → the cookie belongs to a different account than what the
    // frontend thinks. Clear state and force re-login with the correct account.
    if (status === 403 && !url.includes("/auth/me")) {
      window.location.href = "/login";
    }

    return Promise.reject(err);
  }
);

export default api;