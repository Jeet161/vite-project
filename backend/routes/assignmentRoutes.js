import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import {
  createAssignment,
  getAssignments,
  submitAssignment,
  getSubmissions,
  gradeSubmission,
  closeAssignment,
} from "../controllers/assignmentController.js";
import { protect } from "../middleware/authMiddleware.js";
import { restrictTo } from "../middleware/roleMiddleware.js";

const router = express.Router();

// ── File storage config ───────────────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "uploads"));
  },
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  // Allow common document & image types
  const allowed = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/jpeg",
    "image/png",
    "application/zip",
    "text/plain",
  ];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("File type not allowed. Use PDF, DOCX, JPG, PNG, ZIP or TXT."), false);
  }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 20 * 1024 * 1024 } }); // 20 MB

// ── Teacher routes ────────────────────────────────────────────────────────────
router.post(
  "/",
  protect,
  restrictTo("TEACHER"),
  upload.single("file"),
  createAssignment
);

router.get(
  "/",
  protect,
  restrictTo("TEACHER", "STUDENT"),
  getAssignments
);

router.get(
  "/:id/submissions",
  protect,
  restrictTo("TEACHER"),
  getSubmissions
);

router.put(
  "/submissions/:id/grade",
  protect,
  restrictTo("TEACHER"),
  gradeSubmission
);

router.patch(
  "/:id/close",
  protect,
  restrictTo("TEACHER"),
  closeAssignment
);

// ── Student routes ────────────────────────────────────────────────────────────
router.post(
  "/:id/submit",
  protect,
  restrictTo("STUDENT"),
  upload.single("file"),
  submitAssignment
);

// ── Multer error handler (must be last) ──────────────────────────────────────
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError || err.message?.includes("File type")) {
    return res.status(400).json({ message: err.message });
  }
  next(err);
});

export default router;
