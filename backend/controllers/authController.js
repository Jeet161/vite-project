import {
  registerUser,
  loginUser,
  approveUser,
  rejectUser,
  getPendingUsers,
} from "../services/authService.js";
import { signToken } from "../utils/jwtHelper.js";

// Register
export const register = async (req, res) => {
  try {
    const { name, email, phone, department, role } = req.body;

    if (!name || !email || !department || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!["STUDENT", "TEACHER"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await registerUser(name, email, phone, department, role);
    res.status(201).json({ message: "Registration submitted, waiting for admin approval", user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { uniqueId, password } = req.body;

    if (!uniqueId || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await loginUser(uniqueId, password);
    const token = signToken({ id: user.id, role: user.role });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        uniqueId: user.uniqueId,
        department: user.department,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Logout
export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
};

// Approve user — admin only
export const approve = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await approveUser(Number(userId));
    res.status(200).json({ message: "User approved successfully", user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Reject user — admin only
export const reject = async (req, res) => {
  try {
    const { userId } = req.params;
    await rejectUser(Number(userId));
    res.status(200).json({ message: "User rejected successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get pending users — admin only
export const pending = async (req, res) => {
  try {
    const users = await getPendingUsers();
    res.status(200).json({ users });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get current logged in user
export const getMe = async (req, res) => {
  res.status(200).json({ user: req.user });
};