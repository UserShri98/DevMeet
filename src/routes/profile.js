const express=require('express');
const app=express();
const profileRouter=express.Router();
const userauth=require('../middlewares/auth');
const { validateProfileRequest } = require('../utils/validation');

profileRouter.get('/profile/view',userauth,(req,res)=>{
 try {
    const user=req.user
    res.send(user)

 } catch (error) {
    res.status(400).send("Invalid credentials")
 }
})

profileRouter.patch('/profile/edit',userauth,async(req,res)=>{
   try{
    if(!validateProfileRequest(req)){
      throw new Error("Profile not validated")
    }

    const loggedInUser=req.user;

    Object.keys(req.body).forEach((key)=>loggedInUser[key]=req.body[key]);

   await loggedInUser.save();

    res.json({message:`${loggedInUser.firstName}, Profile updated successfully`,data:loggedInUser})
   }catch(err){
   console.log("Error",err.message)
     return res.status(400).send(err.message);

   }
})

module.exports=profileRouter;
