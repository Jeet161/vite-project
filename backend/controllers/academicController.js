import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// ── SUBJECTS ────────────────────────────────────────────────────────────────

export const getSubjects = async (req, res) => {
  try {
    const subjects = await prisma.subject.findMany({
      orderBy: { semester: "asc" }
    });
    res.json({ subjects });
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const createSubject = async (req, res) => {
  try {
    const { name, code, department, semester } = req.body;
    
    // Check if code exists
    const existing = await prisma.subject.findUnique({ where: { code } });
    if (existing) {
      return res.status(400).json({ message: "Subject code already exists" });
    }

    const subject = await prisma.subject.create({
      data: {
        name,
        code,
        department,
        semester: Number(semester)
      }
    });

    res.status(201).json({ subject, message: "Subject created successfully" });
  } catch (error) {
    console.error("Error creating subject:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.subject.delete({
      where: { id: Number(id) }
    });
    res.json({ message: "Subject deleted successfully" });
  } catch (error) {
    console.error("Error deleting subject:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ── GRADING POLICIES ────────────────────────────────────────────────────────

export const getGradingPolicies = async (req, res) => {
  try {
    const policies = await prisma.gradingPolicy.findMany({
      orderBy: { minScore: "desc" }
    });
    res.json({ policies });
  } catch (error) {
    console.error("Error fetching grading policies:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateGradingPolicies = async (req, res) => {
  try {
    const { policies } = req.body;
    if (!Array.isArray(policies)) {
      return res.status(400).json({ message: "Policies must be an array" });
    }

    await prisma.$transaction(async (tx) => {
      await tx.gradingPolicy.deleteMany({});
      
      if (policies.length > 0) {
        await tx.gradingPolicy.createMany({
          data: policies.map(p => ({
            grade: p.grade,
            label: p.label,
            minScore: Number(p.minScore || p.min),
            maxScore: Number(p.maxScore || p.max),
            gradePoints: Number(p.gradePoints || p.points)
          }))
        });
      }
    });

    res.json({ message: "Grading policies updated successfully" });
  } catch (error) {
    console.error("Error updating grading policies:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
