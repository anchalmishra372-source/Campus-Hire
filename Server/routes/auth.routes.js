import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { auth } from "../middleware/auth.js";
const router = Router();
router.post("/register", async (req, res, next) => {
  try {
    const { fullname, email, password, role = "student" } = req.body;
    if (!fullname || !email || !password) return res.status(400).json({ success: false, message: "Please fill all required fields" });
    if (!["student", "recruiter"].includes(role)) return res.status(403).json({ success: false, message: "Admin signup is disabled" });
    if (password.length < 6) return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    if (await User.findOne({ email })) return res.status(409).json({ success: false, message: "Email already registered" });
    const user = await User.create({ fullname, email, password: await bcrypt.hash(password, 10), role });
    res.status(201).json({ success: true, user: { id: user._id, fullname, email, role } });
  } catch (e) { next(e); }
});
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password || "", user.password))) return res.status(401).json({ success: false, message: "Invalid email or password" });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.cookie("token", token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 86400000 });
    res.json({ success: true, user: { id: user._id, fullname: user.fullname, email: user.email, role: user.role } });
  } catch (e) { next(e); }
});
router.post("/logout", (_req, res) => { res.clearCookie("token"); res.json({ success: true }); });
router.get("/me", auth, async (req, res, next) => {
  try { const user = await User.findById(req.userId).select("-password"); if (!user) return res.status(404).json({ success: false, message: "User not found" }); res.json({ success: true, user }); }
  catch (e) { next(e); }
});
export default router;
