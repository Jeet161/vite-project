import express from "express";
import {
  generateCode,
  markAttendance,
  getMyAttendance,
} from "../controllers/attendanceController.js";
import { protect } from "../middleware/authMiddleware.js";
import { restrictTo } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Teacher generates a code
router.post("/generate", protect, restrictTo("TEACHER"), generateCode);

// Student submits a code
router.post("/mark",     protect, restrictTo("STUDENT"), markAttendance);

// Student views their attendance
router.get("/my",        protect, restrictTo("STUDENT"), getMyAttendance);

export default router;