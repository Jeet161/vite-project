import api from "./api.js";

// Teacher: generate attendance code
export const generateAttendanceCode = () =>
  api.post("/attendance/generate");

// Student: submit code to mark present
export const markAttendance = (code) =>
  api.post("/attendance/mark", { code });

// Student: get own attendance history
export const getMyAttendance = () =>
  api.get("/attendance/my");