const express=require('express');
const app=express();
const requestRouter=express.Router();
const userauth=require('../middlewares/auth');
const connection= require('../models/connectionRequest');
const User=require('../models/user')


requestRouter.post('/send/request/:status/:toUserId',userauth,async(req,res)=>{
  try{

    const fromUserId=req.user._id;
    const toUserId=req.params.toUserId;
    const status=req.params.status;

    const isUserInDb=await User.findById(toUserId);
    if(!isUserInDb){
      return res.status(400).json({message:"User not found"})
    }

    const existingConnection=await connection.findOne({
      $or:[
        {toUserId,fromUserId},
        {toUserId:fromUserId,fromUserId:toUserId}
      ]
    })
    if(existingConnection){
      return res.status(400).json({message:"Connection request already exists"})
    }

    const allowedStatus=["interested","ignored"];

    if(!allowedStatus.includes(status)){
      throw new Error("This status is not allowed",status)
    }

    const connectionRequest= await new connection({
      toUserId,
      fromUserId,
      status
    })

    const data=await connectionRequest.save();

    res.json({message:status==="interested"? `${req.user.firstName} has sent a request to ${isUserInDb.firstName}`:`${isUserInDb.firstName} has ignored the request `},data)

  }catch(err){
    res.status(400).send("Error: "+err.message);
  }
  
})

module.exports=requestRouter;