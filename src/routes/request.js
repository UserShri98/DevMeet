const express=require('express');
const app=express();
const requestRouter=express.Router();
const userauth=require('../middlewares/auth')


requestRouter.post('/sendconnectionrequest',userauth,(req,res)=>{
  const user=req.user;

  res.send(user.firstName + " sent a connection request")
  
})

module.exports=requestRouter;