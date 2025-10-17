const express=require('express');
const adminAuth=require('./middlewares/auth')
const app=express();
const connectDB=require('./config/db')
const User=require('./models/user')
const {validation}=require('./utils/validation')
const bcrypt=require('bcrypt');
const userauth=require('./middlewares/auth')
const jwt=require("jsonwebtoken");
const cookieParser = require('cookie-parser');

app.use(express.json())
app.use(cookieParser())


app.post('/signup',async(req,res)=>{
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

app.post('/login',async(req,res)=>{
    try {
        
        const {email,password}=req.body;

        const user=await User.findOne({email});
        if(!user){
            res.status(401).send("Invalid credentials")
        }

        const newPassword= await user.comparePasswords();
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

app.get('/profile',userauth,(req,res)=>{
 try {
    const user=req.user
    res.send(user)

 } catch (error) {
    res.status(400).send("Invalid credentials")
 }
})

app.post('/sendconnectionrequest',userauth,(req,res)=>{
  const user=req.user;

  res.send(user.firstName + " sent a connection request")
  
})


// app.post('/users', async (req, res) => {


//   try {
//     validation(req);

//     const {firstName,lastName,email,password}=req.body;

//     const hashedPaswword=await bcrypt.hash(password,10);
//    console.log(hashedPaswword);
//     const user =new User({
//         firstName,
//         lastName,
//         email,
//         password:hashedPaswword
//     })
//     await user.save();
//     res.status(201).json(user);
//   } catch (err) {
//     res.status(500).json({ message: "Error saving user", error: err.message });
//   }
// });



connectDB()
.then(()=>{
    console.log("Database connection is successful")
    app.listen(3000,(req,res)=>{
    console.log("Server is listening on PORT 3000...")
})
})
.catch((err)=>console.log("Error while connecting database" , err));


