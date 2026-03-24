import api from "./api";

// ═══════════════════════════════════════════════════════════════
// Admin Service
// ═══════════════════════════════════════════════════════════════

/**
 * Creates a new user in the database with generated credentials.
 * @param {Object} userData - { uniqueId, password, role, fullName, email, department }
 */
export const createApprovedUser = async (userData) => {
  return api.post("/admin/users", userData);
};

/**
 * Get all registration requests. Optionally filter by status.
 * @param {string} status - PENDING | APPROVED | REJECTED | (empty = all)
 */
export const getRegistrationRequests = (status) => {
  const params = status ? `?status=${status}` : "";
  return api.get(`/admin/requests${params}`);
};

/**
 * Approve a registration request. Generates unique ID + temp password and emails credentials.
 * @param {string} id - Request ID
 */
export const approveRegistrationRequest = (id) =>
  api.post(`/admin/requests/${id}/approve`);

/**
 * Reject a registration request.
 * @param {string} id - Request ID
 */
export const rejectRegistrationRequest = (id) =>
  api.post(`/admin/requests/${id}/reject`);

