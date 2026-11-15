import { Router } from "express";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import Notification from "../models/Notification.js";
import { auth, allow } from "../middleware/auth.js";
const router = Router();
router.get("/", async (req, res, next) => {
  try {
    const { search, location, type } = req.query; const filter = { status: "active" };
    if (search) filter.$or = [{ title: new RegExp(search, "i") }, { company: new RegExp(search, "i") }, { description: new RegExp(search, "i") }];
    if (location) filter.location = new RegExp(location, "i"); if (type) filter.jobType = type;
    res.json({ success: true, jobs: await Job.find(filter).sort({ createdAt: -1 }).limit(100) });
  } catch (e) { next(e); }
});
router.get("/:id", async (req, res, next) => {
  try { const job = await Job.findById(req.params.id); if (!job) return res.status(404).json({ success: false, message: "Job not found" }); res.json({ success: true, job }); }
  catch (e) { next(e); }
});
router.post("/", auth, allow("recruiter", "admin"), async (req, res, next) => {
  try { const job = await Job.create({ ...req.body, createdBy: req.userId }); res.status(201).json({ success: true, job }); }
  catch (e) { next(e); }
});
router.put("/:id", auth, allow("recruiter", "admin"), async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id); if (!job) return res.status(404).json({ success: false, message: "Job not found" });
    if (req.currentUser.role !== "admin" && String(job.createdBy) !== req.userId) return res.status(403).json({ success: false, message: "Not your job" });
    Object.assign(job, req.body); await job.save(); res.json({ success: true, job });
  } catch (e) { next(e); }
});
router.delete("/:id", auth, allow("recruiter", "admin"), async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id); if (!job) return res.status(404).json({ success: false, message: "Job not found" });
    if (req.currentUser.role !== "admin" && String(job.createdBy) !== req.userId) return res.status(403).json({ success: false, message: "Not your job" });
    await Application.deleteMany({ job: job._id }); await job.deleteOne(); res.json({ success: true, message: "Job deleted" });
  } catch (e) { next(e); }
});
router.post("/:id/apply", auth, allow("student"), async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id); if (!job || job.status !== "active") return res.status(404).json({ success: false, message: "Job unavailable" });
    const application = await Application.create({ job: job._id, student: req.userId, coverLetter: req.body.coverLetter || "" });
    await Notification.create({ user: job.createdBy, message: `New application received for ${job.title}`, link: "/recruiter/applicants" });
    res.status(201).json({ success: true, application });
  } catch (e) { if (e.code === 11000) return res.status(409).json({ success: false, message: "You already applied" }); next(e); }
});
router.get("/:id/applicants", auth, allow("recruiter", "admin"), async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id); if (!job) return res.status(404).json({ success: false, message: "Job not found" });
    if (req.currentUser.role !== "admin" && String(job.createdBy) !== req.userId) return res.status(403).json({ success: false, message: "Access denied" });
    const applications = await Application.find({ job: job._id }).populate("student", "fullname email phone skills resumeUrl resumeOriginalName").sort({ createdAt: -1 });
    res.json({ success: true, applications });
  } catch (e) { next(e); }
});
router.patch("/applications/:applicationId/status", auth, allow("recruiter", "admin"), async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.applicationId).populate("job");
    if (!application) return res.status(404).json({ success: false, message: "Application not found" });
    if (req.currentUser.role !== "admin" && String(application.job.createdBy) !== req.userId) return res.status(403).json({ success: false, message: "Access denied" });
    if (!["reviewing", "shortlisted", "rejected"].includes(req.body.status)) return res.status(400).json({ success: false, message: "Invalid status" });
    application.status = req.body.status; await application.save();
    await Notification.create({ user: application.student, message: `Your application for ${application.job.title} is now ${req.body.status}.`, link: "/my-applications" });
    res.json({ success: true, application });
  } catch (e) { next(e); }
});
export default router;
