import api from "./api.js";

// Teacher: generate attendance code for a specific class slot (1–5)
export const generateAttendanceCode = (classSlot) =>
  api.post("/attendance/generate", { classSlot });

// Teacher: get today's session status (which slots are active/expired/empty)
export const getSessionStatus = () =>
  api.get("/attendance/sessions");

// Teacher: get class-wise attendance report for today
export const getClassReport = () =>
  api.get("/attendance/report");

// Student: submit code to mark present for that class session
export const markAttendance = (code) =>
  api.post("/attendance/mark", { code });

// Student: get own attendance history
export const getMyAttendance = () =>
  api.get("/attendance/my");