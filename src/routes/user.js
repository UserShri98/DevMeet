const express=require('express');
const userRouter=express.Router();
const userauth=require('../middlewares/auth')
const ConnectionRequest=require('../models/connectionRequest')
const User=require('../models/user')

const USER_SAFE_DETAILS="firstName lastName skills about photoUrl gender"

userRouter.get('/user/requests/received',userauth,async(req,res)=>{

try{
     
    const loggedInUser=req.user;

    const connectionRequest=await ConnectionRequest.find({
        toUserId:loggedInUser._id,
        status:"interested"
    }).populate( "fromUserId",USER_SAFE_DETAILS)


   res.json({messsage:"Fetched all pending connections", data:connectionRequest})

}catch(err){
    res.status(404).send("ERROR" +err.message)
}
})


userRouter.get('/user/connections',userauth,async(req,res)=>{
    const loggedInUser=req.user;
  
   const connectionRequest=await ConnectionRequest.find({
    $or:[
        {fromUserId:loggedInUser._id,status:"accepted"},
        {toUserId:loggedInUser._id,status:"accepted"},
    ]
   }).populate( "fromUserId",USER_SAFE_DETAILS).populate("toUserId",USER_SAFE_DETAILS)


     const data=connectionRequest.map((row)=>{
 if(row.fromUserId.toString()===loggedInUser._id.toString()){
    return row.toUserId;
   }
      return row.fromUserId;

     })

  res.json({data})

})

userRouter.get('/feed',userauth,async(req,res)=>{

 try{

  const page=parseInt(req.query.page) || 1;
  let limit=parseInt(req.query.limit) || 10;
  limit=limit>50?50:limit;
  const skip=(page-1)*limit;

   const loggedInUser=req.user;

   const connectionRequest=await ConnectionRequest.find({
    $or:[
        {fromUserId:loggedInUser._id},
        {toUserId:loggedInUser._id}
    ]
   }).select("fromUserId toUserId");


   const hideFromList=new Set();
   connectionRequest.forEach((req)=>{
    hideFromList.add(req.fromUserId.toString());
    hideFromList.add(req.toUserId.toString());
   })

   const users=await User.find({
    $and:[
        {_id:{$nin:Array.from(hideFromList)}},
        {_id:{$ne:loggedInUser._id}}

    ]
   }).select(USER_SAFE_DETAILS).skip(skip).limit(limit);

   res.json(users);

 }catch(err){
    res.status(400).json({message:err.message})
 }

})

module.exports=userRouter;