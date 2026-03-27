import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// ─── GET /api/users/me ────────────────────────────────────────────────────────
export const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id:         true,
        uniqueId:   true,
        name:       true,
        email:      true,
        phone:      true,
        department: true,
        role:       true,
        status:     true,
        createdAt:  true,
      },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (err) {
    console.error("getMe error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ─── PATCH /api/users/me ──────────────────────────────────────────────────────
export const updateMe = async (req, res) => {
  const { name, email, phone, currentPassword, newPassword } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    const updateData = {};

    if (name?.trim())  updateData.name  = name.trim();
    if (phone?.trim()) updateData.phone = phone.trim();

    // Email uniqueness check
    if (email?.trim() && email.trim() !== user.email) {
      const existing = await prisma.user.findUnique({
        where: { email: email.trim() },
      });
      if (existing) return res.status(409).json({ message: "Email already in use" });
      updateData.email = email.trim();
    }

    // Password change (optional)
    if (newPassword) {
      if (!currentPassword)
        return res.status(400).json({ message: "Current password is required" });

      const match = await bcrypt.compare(currentPassword, user.password);
      if (!match)
        return res.status(401).json({ message: "Current password is incorrect" });

      if (newPassword.length < 6)
        return res.status(400).json({ message: "New password must be at least 6 characters" });

      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    if (Object.keys(updateData).length === 0)
      return res.status(400).json({ message: "No changes to save" });

    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data:  updateData,
      select: {
        id:         true,
        uniqueId:   true,
        name:       true,
        email:      true,
        phone:      true,
        department: true,
        role:       true,
        status:     true,
        createdAt:  true,
      },
    });

    res.json({ message: "Profile updated successfully", user: updated });
  } catch (err) {
    console.error("updateMe error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};