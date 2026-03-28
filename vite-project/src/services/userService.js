import api from "./api.js";

/** GET /api/users/me  – full profile from DB */
export const getProfile = () => api.get("/users/me");

/** PATCH /api/users/me  – update editable fields */
export const updateProfile = (data) => api.patch("/users/me", data);
