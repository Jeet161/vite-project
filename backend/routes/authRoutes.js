import express from "express";
import {
  register,
  login,
  logout,
  approve,
  reject,
  pending,
  getMe,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { restrictTo } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// Protected routes
router.get("/me", protect, getMe);

// Admin only routes
router.get("/pending", protect, restrictTo("ADMIN"), pending);
router.patch("/approve/:userId", protect, restrictTo("ADMIN"), approve);
router.patch("/reject/:userId", protect, restrictTo("ADMIN"), reject);

export default router;