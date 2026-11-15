import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import User from "../models/User.js";
import Application from "../models/Application.js";
import Job from "../models/Job.js";
import { auth, allow } from "../middleware/auth.js";

const router = Router();

const uploadDir = path.resolve("uploads");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_")}`)
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = [".pdf", ".doc", ".docx"].includes(
      path.extname(file.originalname).toLowerCase()
    );
    cb(ok ? null : new Error("Upload PDF, DOC or DOCX only"), ok);
  }
});

// ADMIN: GET ALL STUDENTS AND RECRUITERS
router.get("/admin/all", auth, allow("admin"), async (req, res, next) => {
  try {
    const users = await User.find({
      role: { $in: ["student", "recruiter"] }
    })
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      users
    });
  } catch (e) {
    next(e);
  }
});

// GET PROFILE
router.get("/profile", auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    res.json({ success: true, user });
  } catch (e) {
    next(e);
  }
});

// UPDATE PROFILE
router.put("/profile", auth, upload.single("resume"), async (req, res, next) => {
  try {
    const data = { ...req.body };

    if (typeof data.skills === "string") {
      data.skills = data.skills.split(",").map(s => s.trim()).filter(Boolean);
    }

    if (req.file) {
      data.resumeUrl = `/uploads/${req.file.filename}`;
      data.resumeOriginalName = req.file.originalname;
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      data,
      { new: true, runValidators: true }
    ).select("-password");

    res.json({ success: true, user });
  } catch (e) {
    next(e);
  }
});

// SAVE / UNSAVE JOB
router.post("/saved/:jobId", auth, allow("student"), async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }

    const user = await User.findById(req.userId);
    const exists = user.savedJobs.some(id => String(id) === String(job._id));

    if (exists) user.savedJobs.pull(job._id);
    else user.savedJobs.push(job._id);

    await user.save();

    res.json({ success: true, saved: !exists });
  } catch (e) {
    next(e);
  }
});

// GET SAVED JOBS
router.get("/saved", auth, allow("student"), async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).populate("savedJobs");
    res.json({ success: true, jobs: user.savedJobs });
  } catch (e) {
    next(e);
  }
});

// GET STUDENT APPLICATIONS
router.get("/applications", auth, allow("student"), async (req, res, next) => {
  try {
    const applications = await Application.find({
      student: req.userId
    })
      .populate("job")
      .sort({ createdAt: -1 });

    res.json({ success: true, applications });
  } catch (e) {
    next(e);
  }
});

export default router;