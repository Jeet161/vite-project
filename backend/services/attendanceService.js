import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const VALID_SLOTS = [1, 2, 3, 4, 5];

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

// Create a new attendance session for a specific class slot (1–5)
export const createSession = async (teacherId, department, classSlot) => {
  const slot = parseInt(classSlot, 10);

  if (!VALID_SLOTS.includes(slot)) {
    throw new Error("Invalid class slot. Must be 1–5.");
  }

  // Set date to today midnight (for daily uniqueness)
  const date = new Date();
  date.setHours(0, 0, 0, 0);

  // Check if a session already exists for this slot+dept today
  const existing = await prisma.attendanceSession.findUnique({
    where: {
      department_date_classSlot: {
        department,
        date,
        classSlot: slot,
      },
    },
  });

  if (existing) {
    // If existing session is still active, return it
    if (new Date() < new Date(existing.expiresAt)) {
      const secondsLeft = Math.round(
        (new Date(existing.expiresAt) - new Date()) / 1000
      );
      return { ...existing, secondsLeft, alreadyExists: true };
    }
    // If expired, delete it so a new one can be created
    await prisma.attendanceSession.delete({ where: { id: existing.id } });
  }

  const code = await generateUniqueCode();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 3 * 60 * 1000); // 3 minutes

  const session = await prisma.attendanceSession.create({
    data: {
      code,
      teacherId,
      department,
      classSlot: slot,
      date,
      expiresAt,
    },
  });

  const secondsLeft = Math.round((expiresAt - now) / 1000);
  return { ...session, secondsLeft, alreadyExists: false };
};

// Get today's session status for a department (which slots are active/expired/empty)
export const getTodaySessionStatus = async (department) => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);

  const sessions = await prisma.attendanceSession.findMany({
    where: { department, date },
    select: {
      id: true,
      classSlot: true,
      code: true,
      expiresAt: true,
      createdAt: true,
      _count: { select: { records: true } },
    },
    orderBy: { classSlot: "asc" },
  });

  const now = new Date();

  // Build a map of slot → session info
  const slotMap = {};
  for (const s of sessions) {
    slotMap[s.classSlot] = {
      sessionId: s.id,
      classSlot: s.classSlot,
      code: s.code,
      expiresAt: s.expiresAt,
      isActive: now < new Date(s.expiresAt),
      studentCount: s._count.records,
    };
  }

  // Return all 5 slots
  return VALID_SLOTS.map((slot) =>
    slotMap[slot] ?? {
      sessionId: null,
      classSlot: slot,
      code: null,
      expiresAt: null,
      isActive: false,
      studentCount: 0,
    }
  );
};

// Validate code and mark student as PRESENT for that class session
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
  console.log("SESSION DEPT:", session.department, "| STUDENT DEPT:", department);
  
  // Check department match
  if (session.department !== department) {
    throw new Error("This code is not valid for your department");
  }

  // Check if student already marked for this specific session
  const alreadyMarked = await prisma.attendance.findUnique({
    where: {
      studentId_sessionId: {
        studentId,
        sessionId: session.id,
      },
    },
  });

  if (alreadyMarked) {
    throw new Error(
      `You have already marked attendance for Class ${session.classSlot}`
    );
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Mark as PRESENT
  const record = await prisma.attendance.create({
    data: {
      studentId,
      sessionId: session.id,
      date: today,
      status: "PRESENT",
    },
  });

  return { ...record, classSlot: session.classSlot };
};

// Get all attendance records for a student with per-day / per-slot breakdown
export const getStudentAttendance = async (studentId) => {
  const records = await prisma.attendance.findMany({
    where: { studentId },
    orderBy: [{ date: "desc" }, { session: { classSlot: "asc" } }],
    include: {
      session: {
        select: {
          classSlot: true,
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

// Get class-wise attendance report for a department (teacher view)
export const getClassReport = async (department) => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);

  const sessions = await prisma.attendanceSession.findMany({
    where: { department, date },
    include: {
      records: {
        include: {
          student: { select: { id: true, name: true, uniqueId: true } },
        },
      },
    },
    orderBy: { classSlot: "asc" },
  });

  return sessions.map((s) => ({
    classSlot:    s.classSlot,
    code:         s.code,
    expiresAt:    s.expiresAt,
    isActive:     new Date() < new Date(s.expiresAt),
    presentCount: s.records.filter((r) => r.status === "PRESENT").length,
    absentCount:  s.records.filter((r) => r.status === "ABSENT").length,
    records:      s.records,
  }));
};

// Cron job helper — auto mark absent after each session expires
export const autoMarkAbsent = async () => {
  const now = new Date();

  // Get all sessions whose code has expired but may still have uncaptured absences
  const expiredSessions = await prisma.attendanceSession.findMany({
    where: {
      expiresAt: { lt: now },
    },
  });

  if (expiredSessions.length === 0) return;

  for (const session of expiredSessions) {
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
      const exists = await prisma.attendance.findUnique({
        where: {
          studentId_sessionId: {
            studentId: student.id,
            sessionId: session.id,
          },
        },
      });

      if (!exists) {
        await prisma.attendance.create({
          data: {
            studentId: student.id,
            sessionId: session.id,
            date:      session.date,
            status:    "ABSENT",
          },
        });
      }
    }
  }
};