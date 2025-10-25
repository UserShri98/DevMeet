const express=require('express');
const app=express();
const profileRouter=express.Router();
const userauth=require('../middlewares/auth')




profileRouter.get('/profile',userauth,(req,res)=>{
 try {
    const user=req.user
    res.send(user)

 } catch (error) {
    res.status(400).send("Invalid credentials")
 }
})

module.exports=profileRouter;