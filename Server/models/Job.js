import mongoose from "mongoose";
const schema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  requirements: [String], location: String, jobType: { type: String, default: "Full-time" },
  salary: String, experienceLevel: String, category: String, company: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["active", "closed"], default: "active" }
}, { timestamps: true });
export default mongoose.model("Job", schema);
