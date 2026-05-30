import api from "./api.js";

// ── Teacher ───────────────────────────────────────────────────────────────────

/**
 * Create a new assignment (with optional file attachment).
 * @param {FormData} formData - Must include: title, dueDate. Optional: description, subjectCode, maxScore, file.
 */
export const createAssignment = (formData) =>
  api.post("/assignments", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

/**
 * Get all submissions for a specific assignment (teacher only).
 * @param {number} assignmentId
 */
export const getSubmissions = (assignmentId) =>
  api.get(`/assignments/${assignmentId}/submissions`);

/**
 * Grade a student submission.
 * @param {number} submissionId
 * @param {number} score
 * @param {string} [feedback]
 */
export const gradeSubmission = (submissionId, score, feedback = "") =>
  api.put(`/assignments/submissions/${submissionId}/grade`, { score, feedback });

/**
 * Close an assignment so students can no longer submit.
 * @param {number} assignmentId
 */
export const closeAssignment = (assignmentId) =>
  api.patch(`/assignments/${assignmentId}/close`);

// ── Shared ────────────────────────────────────────────────────────────────────

/**
 * Get assignments.
 * - Teacher: returns their own published assignments.
 * - Student: returns all ACTIVE assignments for their department.
 */
export const getAssignments = () => api.get("/assignments");

// ── Student ───────────────────────────────────────────────────────────────────

/**
 * Submit a file for an assignment.
 * @param {number} assignmentId
 * @param {FormData} formData - Must include: file (the submission file).
 */
export const submitAssignment = (assignmentId, formData) =>
  api.post(`/assignments/${assignmentId}/submit`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
