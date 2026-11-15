import { Router } from "express";
import Notification from "../models/Notification.js";
import { auth } from "../middleware/auth.js";
const router=Router();
router.get("/",auth,async(req,res,next)=>{try{const notifications=await Notification.find({user:req.userId}).sort({createdAt:-1}).limit(60);res.json({success:true,notifications});}catch(e){next(e);}});
router.patch("/read-all",auth,async(req,res,next)=>{try{await Notification.updateMany({user:req.userId},{read:true});res.json({success:true});}catch(e){next(e);}});
router.patch("/:id/read",auth,async(req,res,next)=>{try{const n=await Notification.findOneAndUpdate({_id:req.params.id,user:req.userId},{read:true},{new:true});if(!n)return res.status(404).json({success:false,message:"Notification not found"});res.json({success:true,notification:n});}catch(e){next(e);}});
export default router;
