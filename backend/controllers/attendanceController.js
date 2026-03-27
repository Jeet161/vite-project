import {
  createSession,
  markStudentPresent,
  getStudentAttendance,
} from "../services/attendanceService.js";

// ─── POST /api/attendance/generate ───────────────────────────────────────────
// Teacher generates an attendance code for today
export const generateCode = async (req, res) => {
  try {
    const { id: teacherId, department } = req.user;

    const session = await createSession(teacherId, department);

    // Calculate seconds remaining
    const secondsLeft = Math.round(
      (new Date(session.expiresAt) - new Date()) / 1000
    );

    res.status(201).json({
      message:    "Attendance code generated",
      code:       session.code,
      expiresAt:  session.expiresAt,
      secondsLeft,
    });
  } catch (err) {
    console.error("generateCode error:", err);
    res.status(500).json({ message: "Failed to generate code" });
  }
};

// ─── POST /api/attendance/mark ────────────────────────────────────────────────
// Student submits the code to mark attendance
export const markAttendance = async (req, res) => {
  try {
    const { code } = req.body;
    const { id: studentId, department } = req.user;

    if (!code) {
      return res.status(400).json({ message: "Code is required" });
    }

    const record = await markStudentPresent(studentId, code, department);

    res.status(200).json({
      message: "Attendance marked successfully",
      record,
    });
  } catch (err) {
    console.error("markAttendance error:", err);
    res.status(400).json({ message: err.message });
  }
};

// ─── GET /api/attendance/my ───────────────────────────────────────────────────
// Student views their own attendance history + summary
export const getMyAttendance = async (req, res) => {
  try {
    const { id: studentId } = req.user;

    const data = await getStudentAttendance(studentId);

    res.status(200).json(data);
  } catch (err) {
    console.error("getMyAttendance error:", err);
    res.status(500).json({ message: "Failed to fetch attendance" });
  }
};