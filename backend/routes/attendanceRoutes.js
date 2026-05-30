import express from "express";
import {
  generateCode,
  markAttendance,
  getMyAttendance,
  getSessionStatus,
  getTeacherReport,
} from "../controllers/attendanceController.js";
import { protect } from "../middleware/authMiddleware.js";
import { restrictTo } from "../middleware/roleMiddleware.js";

const router = express.Router();

// ── Teacher routes ────────────────────────────────────────────────────────────

// Generate a code for a specific class slot (1–5)
router.post("/generate",  protect, restrictTo("TEACHER"), generateCode);

// Get today's session status (which slots are active/taken)
router.get("/sessions",   protect, restrictTo("TEACHER"), getSessionStatus);

// Get class-wise attendance report for today
router.get("/report",     protect, restrictTo("TEACHER"), getTeacherReport);

// ── Student routes ────────────────────────────────────────────────────────────

// Submit a code to mark attendance for that class
router.post("/mark",      protect, restrictTo("STUDENT"), markAttendance);

// View own attendance history
router.get("/my",         protect, restrictTo("STUDENT"), getMyAttendance);

export default router;