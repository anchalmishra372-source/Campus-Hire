import jwt from "jsonwebtoken";
import User from "../models/User.js";
export const auth = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ success: false, message: "Please login first" });
  try { req.userId = jwt.verify(token, process.env.JWT_SECRET).userId; next(); }
  catch { res.status(401).json({ success: false, message: "Session expired. Please login again." }); }
};
export const allow = (...roles) => async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || !roles.includes(user.role)) return res.status(403).json({ success: false, message: "Access denied" });
    req.currentUser = user; next();
  } catch (e) { next(e); }
};
