import {
  createSession,
  markStudentPresent,
  getStudentAttendance,
  getTodaySessionStatus,
  getClassReport,
} from "../services/attendanceService.js";

// ─── POST /api/attendance/generate ───────────────────────────────────────────
// Teacher generates an attendance code for a specific class slot (1–5)
export const generateCode = async (req, res) => {
  try {
    const { id: teacherId, department } = req.user;
    const { classSlot } = req.body;

    if (!classSlot) {
      return res.status(400).json({ message: "classSlot is required (1–5)" });
    }

    const session = await createSession(teacherId, department, classSlot);

    res.status(201).json({
      message:      session.alreadyExists
        ? "Active session already exists for this slot"
        : "Attendance code generated",
      code:         session.code,
      classSlot:    session.classSlot,
      expiresAt:    session.expiresAt,
      secondsLeft:  session.secondsLeft,
      alreadyExists: session.alreadyExists,
    });
  } catch (err) {
    console.error("generateCode error:", err);
    res.status(400).json({ message: err.message || "Failed to generate code" });
  }
};

// ─── GET /api/attendance/sessions ────────────────────────────────────────────
// Teacher sees which of the 5 slots have active/expired sessions today
export const getSessionStatus = async (req, res) => {
  try {
    const { department } = req.user;
    const slots = await getTodaySessionStatus(department);
    res.status(200).json(slots);
  } catch (err) {
    console.error("getSessionStatus error:", err);
    res.status(500).json({ message: "Failed to fetch session status" });
  }
};

// ─── GET /api/attendance/report ───────────────────────────────────────────────
// Teacher — class-wise attendance report for today
export const getTeacherReport = async (req, res) => {
  try {
    const { department } = req.user;
    const report = await getClassReport(department);
    res.status(200).json(report);
  } catch (err) {
    console.error("getTeacherReport error:", err);
    res.status(500).json({ message: "Failed to fetch report" });
  }
};

// ─── POST /api/attendance/mark ────────────────────────────────────────────────
// Student submits the code to mark attendance for that class slot
export const markAttendance = async (req, res) => {
  try {
    const { code } = req.body;
    const { id: studentId, department } = req.user;

    if (!code) {
      return res.status(400).json({ message: "Code is required" });
    }

    const record = await markStudentPresent(studentId, code, department);

    res.status(200).json({
      message:   `Attendance marked for Class ${record.classSlot}`,
      classSlot: record.classSlot,
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