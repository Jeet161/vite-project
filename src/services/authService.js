import api from "./api";

// Admin login (pre-generated credentials)
export const adminLogin = (email, password) =>
  api.post("/auth/admin/login", { email, password });

// Student / Teacher login using Unique ID + password sent via email
export const userLogin = (uniqueId, password, role) =>
  api.post("/auth/login", { uniqueId, password, role });

// Student self-registration (pending admin approval)
export const registerStudent = (data) =>
  api.post("/auth/register/student", data);

// Teacher self-registration (pending admin approval)
export const registerTeacher = (data) =>
  api.post("/auth/register/teacher", data);

// Validate unique ID before full login
export const validateUniqueId = (uniqueId, role) =>
  api.post("/auth/validate-id", { uniqueId, role });

// Request password reset
export const requestPasswordReset = (email) =>
  api.post("/auth/forgot-password", { email });
