const express=require('express');
const app=express();
const {validation}=require('../utils/validation')
const bcrypt=require('bcrypt');
const User=require('../models/user')


const authRouter=express.Router();

authRouter.post('/signup',async(req,res)=>{
  try {

    validation(req)
      const {firstName,lastName,email,age,password}=req.body;
 

      const hashedPaswword=await bcrypt.hash(password,10);

      const user=new User({
        firstName,
        lastName,
        email,
        age,
        password:hashedPaswword
      })
      await user.save();
      res.send("User added successfully")

  } catch (err) {
        res.status(400).json({ message: "Error", error: err.message });

  }
  
})

authRouter.post('/login',async(req,res)=>{
    try {
        
        const {email,password}=req.body;

        const user=await User.findOne({email});
        if(!user){
            res.status(401).send("Invalid credentials")
        }

        const newPassword= await bcrypt.compare(password,user.password);
        if(newPassword){

          const token= await user.getJWT();
          res.cookie("token",token);
            res.send("Login Successful")
        }else{
          throw new Error("Invalid credentials")
        }
    } catch (err) {
    res.status(400).json({ message: "Error", error: err.message });
  }
})

authRouter.post('/logout',async(req,res)=>{
   res.cookie("token",null,{
    expires:new Date(Date.now())
   })
   res.send("Logout Successfully") 
})

module.exports=authRouter;