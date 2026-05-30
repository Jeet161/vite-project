import { PrismaClient } from "@prisma/client";
import path from "path";
import { fileURLToPath } from "url";

const prisma = new PrismaClient();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper: build full URL for an uploaded file
const buildFileUrl = (req, relativePath) => {
  if (!relativePath) return null;
  return `${req.protocol}://${req.get("host")}/${relativePath.replace(/\\/g, "/")}`;
};

// ─── POST /api/assignments ────────────────────────────────────────────────────
// Teacher: create a new assignment (optionally with a file attachment)
export const createAssignment = async (req, res) => {
  try {
    const { id: teacherId, department } = req.user;
    const { title, description, subjectCode, dueDate, maxScore } = req.body;

    if (!title || !dueDate) {
      return res.status(400).json({ message: "title and dueDate are required" });
    }

    const fileUrl = req.file
      ? buildFileUrl(req, req.file.path)
      : null;

    const assignment = await prisma.assignment.create({
      data: {
        title,
        description:  description  || null,
        subjectCode:  subjectCode  || null,
        fileUrl,
        dueDate:      new Date(dueDate),
        department,
        maxScore:     maxScore ? Number(maxScore) : 100,
        teacherId,
      },
    });

    res.status(201).json({ message: "Assignment created", assignment });
  } catch (err) {
    console.error("createAssignment error:", err);
    res.status(500).json({ message: err.message || "Failed to create assignment" });
  }
};

// ─── GET /api/assignments ─────────────────────────────────────────────────────
// Teacher: see their own assignments.
// Student: see all ACTIVE assignments in their department.
export const getAssignments = async (req, res) => {
  try {
    const { id: userId, role, department } = req.user;

    const where =
      role === "TEACHER"
        ? { teacherId: userId }
        : { department, status: "ACTIVE" };

    const assignments = await prisma.assignment.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        teacher: { select: { id: true, name: true } },
        // For teachers: include submission count
        _count: { select: { submissions: true } },
      },
    });

    // For students, attach their own submission info
    if (role === "STUDENT") {
      const mySubmissions = await prisma.submission.findMany({
        where: { studentId: userId },
        select: { assignmentId: true, score: true, feedback: true, fileUrl: true, submittedAt: true },
      });
      const subMap = Object.fromEntries(mySubmissions.map((s) => [s.assignmentId, s]));

      const enriched = assignments.map((a) => ({
        ...a,
        mySubmission: subMap[a.id] || null,
      }));
      return res.status(200).json({ assignments: enriched });
    }

    res.status(200).json({ assignments });
  } catch (err) {
    console.error("getAssignments error:", err);
    res.status(500).json({ message: "Failed to fetch assignments" });
  }
};

// ─── POST /api/assignments/:id/submit ─────────────────────────────────────────
// Student: submit (or re-submit) their work for an assignment
export const submitAssignment = async (req, res) => {
  try {
    const { id: studentId, department } = req.user;
    const assignmentId = Number(req.params.id);

    // Verify assignment belongs to student's department and is still active
    const assignment = await prisma.assignment.findUnique({ where: { id: assignmentId } });
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });
    if (assignment.department !== department)
      return res.status(403).json({ message: "This assignment is not for your department" });
    if (assignment.status === "CLOSED")
      return res.status(400).json({ message: "This assignment is closed" });

    const fileUrl = req.file ? buildFileUrl(req, req.file.path) : null;

    // Upsert: allow re-submission
    const submission = await prisma.submission.upsert({
      where: { studentId_assignmentId: { studentId, assignmentId } },
      update: { fileUrl, submittedAt: new Date() },
      create: { studentId, assignmentId, fileUrl },
    });

    res.status(200).json({ message: "Submission saved", submission });
  } catch (err) {
    console.error("submitAssignment error:", err);
    res.status(500).json({ message: err.message || "Failed to submit assignment" });
  }
};

// ─── GET /api/assignments/:id/submissions ─────────────────────────────────────
// Teacher: get all submissions for a specific assignment they own
export const getSubmissions = async (req, res) => {
  try {
    const { id: teacherId } = req.user;
    const assignmentId = Number(req.params.id);

    const assignment = await prisma.assignment.findUnique({ where: { id: assignmentId } });
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });
    if (assignment.teacherId !== teacherId)
      return res.status(403).json({ message: "You do not own this assignment" });

    const submissions = await prisma.submission.findMany({
      where: { assignmentId },
      include: {
        student: { select: { id: true, name: true, uniqueId: true } },
      },
      orderBy: { submittedAt: "desc" },
    });

    res.status(200).json({ assignment, submissions });
  } catch (err) {
    console.error("getSubmissions error:", err);
    res.status(500).json({ message: "Failed to fetch submissions" });
  }
};

// ─── PUT /api/assignments/submissions/:id/grade ───────────────────────────────
// Teacher: assign a score and optional feedback to a submission
export const gradeSubmission = async (req, res) => {
  try {
    const { id: teacherId } = req.user;
    const submissionId = Number(req.params.id);
    const { score, feedback } = req.body;

    if (score === undefined || score === null) {
      return res.status(400).json({ message: "score is required" });
    }

    // Verify teacher owns the assignment this submission belongs to
    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: { assignment: { select: { teacherId: true, maxScore: true } } },
    });

    if (!submission) return res.status(404).json({ message: "Submission not found" });
    if (submission.assignment.teacherId !== teacherId)
      return res.status(403).json({ message: "You do not own this assignment" });

    const maxScore = submission.assignment.maxScore;
    if (Number(score) < 0 || Number(score) > maxScore)
      return res.status(400).json({ message: `Score must be between 0 and ${maxScore}` });

    const updated = await prisma.submission.update({
      where: { id: submissionId },
      data: { score: Number(score), feedback: feedback || null },
    });

    res.status(200).json({ message: "Submission graded", submission: updated });
  } catch (err) {
    console.error("gradeSubmission error:", err);
    res.status(500).json({ message: err.message || "Failed to grade submission" });
  }
};

// ─── PATCH /api/assignments/:id/close ────────────────────────────────────────
// Teacher: close an assignment
export const closeAssignment = async (req, res) => {
  try {
    const { id: teacherId } = req.user;
    const assignmentId = Number(req.params.id);

    const assignment = await prisma.assignment.findUnique({ where: { id: assignmentId } });
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });
    if (assignment.teacherId !== teacherId)
      return res.status(403).json({ message: "You do not own this assignment" });

    const updated = await prisma.assignment.update({
      where: { id: assignmentId },
      data: { status: "CLOSED" },
    });

    res.status(200).json({ message: "Assignment closed", assignment: updated });
  } catch (err) {
    console.error("closeAssignment error:", err);
    res.status(500).json({ message: err.message || "Failed to close assignment" });
  }
};
