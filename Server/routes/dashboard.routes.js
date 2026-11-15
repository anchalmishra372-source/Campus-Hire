import { Router } from "express";
import Job from "../models/Job.js";
import User from "../models/User.js";
import Application from "../models/Application.js";
import { auth, allow } from "../middleware/auth.js";
const router=Router();
router.get("/admin",auth,allow("admin"),async(_req,res,next)=>{try{
 const [students,recruiters,jobs,applications,recentJobs]=await Promise.all([User.countDocuments({role:"student"}),User.countDocuments({role:"recruiter"}),Job.countDocuments(),Application.countDocuments(),Job.find().sort({createdAt:-1}).limit(6)]);
 const monthly=await Job.aggregate([{$group:{_id:{$month:"$createdAt"},count:{$sum:1}}},{$sort:{_id:1}}]);
 res.json({success:true,stats:{students,recruiters,jobs,applications},recentJobs,monthly});
}catch(e){next(e);}});
router.get("/recruiter",auth,allow("recruiter","admin"),async(req,res,next)=>{try{
 const filter=req.currentUser.role==="admin"?{}:{createdBy:req.userId};const jobs=await Job.find(filter).sort({createdAt:-1});const ids=jobs.map(j=>j._id);
 const applications=await Application.find({job:{$in:ids}}).populate("job","title company").populate("student","fullname email resumeUrl skills").sort({createdAt:-1});
 res.json({success:true,jobs,applications,stats:{jobs:jobs.length,applications:applications.length,shortlisted:applications.filter(a=>a.status==="shortlisted").length}});
}catch(e){next(e);}});
router.get("/analytics",auth,allow("admin","recruiter"),async(req,res,next)=>{try{
 const filter=req.currentUser.role==="admin"?{}:{createdBy:req.userId};const jobs=await Job.find(filter).select("_id");const apps=await Application.find({job:{$in:jobs.map(j=>j._id)}});
 const byStatus=["submitted","reviewing","shortlisted","rejected"].map(status=>({status,count:apps.filter(a=>a.status===status).length}));
 res.json({success:true,totalJobs:jobs.length,totalApplications:apps.length,byStatus});
}catch(e){next(e);}});
export default router;
