import { PrismaClient } from "@prisma/client";
import { hashPassword, comparePassword } from "../utils/passwordHelper.js";
import { generateUniqueId } from "../utils/idGenerator.js";
import { sendApprovalEmail } from "../config/mailer.js";

const prisma = new PrismaClient();

// Register student or teacher
export const registerUser = async (name, email, phone, department, role) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error("Email already registered");

  const user = await prisma.user.create({
    data: {
      name,
      email,
      phone,
      department,
      role,
      password: "",
      status: "PENDING",
    },
  });

  return user;
};

// Login — works for all roles
export const loginUser = async (uniqueId, password) => {
  const user = await prisma.user.findUnique({ where: { uniqueId } });
  if (!user) throw new Error("Invalid credentials");

  if (user.status !== "APPROVED") throw new Error("Account not approved yet");

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  return user;
};

// Admin approves a user
export const approveUser = async (userId) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");
  if (user.status === "APPROVED") throw new Error("User already approved");

  // ✅ Keep generating until we find a truly unique ID
  let uniqueId;
  let attempts = 0;
  while (true) {
    const count = await prisma.user.count({ where: { role: user.role } });
    const candidate = generateUniqueId(user.role, count + 1 + attempts);
    const exists = await prisma.user.findUnique({ where: { uniqueId: candidate } });
    if (!exists) {
      uniqueId = candidate;
      break;
    }
    attempts++;
    if (attempts > 100) throw new Error("Could not generate a unique ID, too many attempts");
  }

  const tempPassword = Math.random().toString(36).slice(-8);
  const hashedPassword = await hashPassword(tempPassword);

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      uniqueId,
      password: hashedPassword,
      status: "APPROVED",
    },
  });

  await sendApprovalEmail(user.email, uniqueId, tempPassword);

  return updatedUser;
};

// Admin rejects a user
export const rejectUser = async (userId) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");

  await prisma.user.update({
    where: { id: userId },
    data: { status: "REJECTED" },
  });
};

// Get all pending users
export const getPendingUsers = async () => {
  return await prisma.user.findMany({
    where: { status: "PENDING" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      department: true,
      role: true,
      createdAt: true,
    },
  });
};