import { PrismaClient } from "@prisma/client";
import { approveUser, rejectUser } from "../services/authService.js";

const prisma = new PrismaClient();

// GET /api/admin/requests?status=PENDING|APPROVED|REJECTED
export const getRequests = async (req, res) => {
  try {
    const { status } = req.query;
    const where = status ? { status } : {};
    const requests = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        department: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        uniqueId: true,
      },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json({ requests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/admin/requests/:id/approve
export const approveRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await approveUser(Number(id));
    res.status(200).json({ message: "User approved successfully", user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// POST /api/admin/requests/:id/reject
export const rejectRequest = async (req, res) => {
  try {
    const { id } = req.params;
    await rejectUser(Number(id));
    res.status(200).json({ message: "User rejected successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET /api/admin/users — all approved users
export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { status: "APPROVED" },
      select: {
        id: true,
        name: true,
        email: true,
        department: true,
        role: true,
        uniqueId: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: "desc" },
    });
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
