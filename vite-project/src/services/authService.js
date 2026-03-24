import api from "./api.js";

// Submit registration request (student/teacher → admin approves)
export const submitRegistrationRequest = (data) =>
  api.post("/auth/register", {
    name: data.fullName.trim(),
    email: data.email.trim().toLowerCase(),
    phone: data.phone?.trim() || null,
    department: data.department,
    role: data.role.toUpperCase(),
  });

// Login — works for all roles (admin, student, teacher)
export const loginUser = (uniqueId, password) =>
  api.post("/auth/login", {
    uniqueId: uniqueId.toUpperCase(),
    password,
  });

// Logout
export const logoutUser = () =>
  api.post("/auth/logout");

// Get current logged in user
export const getCurrentUser = () =>
  api.get("/auth/me");