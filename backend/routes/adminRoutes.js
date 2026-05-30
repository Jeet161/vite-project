import express from "express";
import {
  getRequests,
  approveRequest,
  rejectRequest,
  getUsers,
} from "../controllers/adminController.js";
import {
  getSubjects,
  createSubject,
  deleteSubject,
  getGradingPolicies,
  updateGradingPolicies
} from "../controllers/academicController.js";
import { protect } from "../middleware/authMiddleware.js";
import { restrictTo } from "../middleware/roleMiddleware.js";

const router = express.Router();

// All admin routes require auth + ADMIN role
router.use(protect, restrictTo("ADMIN"));

router.get("/requests", getRequests);
router.post("/requests/:id/approve", approveRequest);
router.post("/requests/:id/reject", rejectRequest);
router.get("/users", getUsers);

// Academic Configuration
router.get("/subjects", getSubjects);
router.post("/subjects", createSubject);
router.delete("/subjects/:id", deleteSubject);

router.get("/grading", getGradingPolicies);
router.put("/grading", updateGradingPolicies);

export default router;
