import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Generate a random 6-character alphanumeric code
export const generateUniqueCode = async () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code;
  let exists = true;

  while (exists) {
    code = Array.from({ length: 6 }, () =>
      chars[Math.floor(Math.random() * chars.length)]
    ).join("");

    const found = await prisma.attendanceSession.findUnique({
      where: { code },
    });
    exists = !!found;
  }

  return code;
};

// Create a new attendance session for today
export const createSession = async (teacherId, department) => {
  const code = await generateUniqueCode();
  const now = new Date();

  // Set date to today midnight (for daily uniqueness)
  const date = new Date();
  date.setHours(0, 0, 0, 0);

  // Code expires in 3 minutes
  const expiresAt = new Date(now.getTime() + 3 * 60 * 1000);

  const session = await prisma.attendanceSession.create({
    data: {
      code,
      teacherId,
      department,
      date,
      expiresAt,
    },
  });

  return session;
};

// Validate code and mark student as PRESENT
export const markStudentPresent = async (studentId, code, department) => {
  const now = new Date();

  // Find the session by code
  const session = await prisma.attendanceSession.findUnique({
    where: { code: code.toUpperCase() },
  });

  if (!session) {
    throw new Error("Invalid attendance code");
  }

  // Check if code has expired
  if (now > session.expiresAt) {
    throw new Error("Attendance code has expired");
  }

  // Check department match
  if (session.department !== department) {
    throw new Error("This code is not valid for your department");
  }

  // Today's date at midnight
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if student already marked attendance today
  const alreadyMarked = await prisma.attendance.findUnique({
    where: {
      studentId_date: {
        studentId,
        date: today,
      },
    },
  });

  if (alreadyMarked) {
    throw new Error("You have already marked attendance today");
  }

  // Mark as PRESENT
  const record = await prisma.attendance.create({
    data: {
      studentId,
      sessionId: session.id,
      date: today,
      status: "PRESENT",
    },
  });

  return record;
};

// Get all attendance records for a student
export const getStudentAttendance = async (studentId) => {
  const records = await prisma.attendance.findMany({
    where: { studentId },
    orderBy: { date: "desc" },
    include: {
      session: {
        select: {
          department: true,
          teacher: {
            select: { name: true },
          },
        },
      },
    },
  });

  const total   = records.length;
  const present = records.filter((r) => r.status === "PRESENT").length;
  const absent  = total - present;
  const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

  return { records, total, present, absent, percentage };
};

// Cron job helper — auto mark absent for students who didn't mark today
export const autoMarkAbsent = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get all sessions for today
  const sessions = await prisma.attendanceSession.findMany({
    where: { date: today },
  });

  if (sessions.length === 0) return;

  for (const session of sessions) {
    // Get all approved students in this department
    const students = await prisma.user.findMany({
      where: {
        role:       "STUDENT",
        status:     "APPROVED",
        department: session.department,
      },
      select: { id: true },
    });

    for (const student of students) {
      // Check if already marked
      const exists = await prisma.attendance.findUnique({
        where: {
          studentId_date: {
            studentId: student.id,
            date: today,
          },
        },
      });

      // If not marked → insert ABSENT
      if (!exists) {
        await prisma.attendance.create({
          data: {
            studentId: student.id,
            sessionId: session.id,
            date:      today,
            status:    "ABSENT",
          },
        });
      }
    }
  }
};