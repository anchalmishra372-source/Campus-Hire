import mongoose from "mongoose";
const schema = new mongoose.Schema({
  fullname: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "recruiter", "admin"], default: "student" },
  phone: String, bio: String, skills: [String], resumeUrl: String, resumeOriginalName: String,
  profilePhoto: String, savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }]
}, { timestamps: true });
export default mongoose.model("User", schema);
