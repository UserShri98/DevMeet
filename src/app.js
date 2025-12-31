require('dotenv').config(); 

const PORT = process.env.PORT || 3000;

const express=require('express');
const adminAuth=require('./middlewares/auth')
const app=express();
const connectDB=require('./config/db')
const User=require('./models/user')
const jwt=require("jsonwebtoken");
const cookieParser = require('cookie-parser');
const cors=require('cors')


app.use(cors({
  origin: "https://dev-meet-web-2726.vercel.app",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json())
app.use(cookieParser())

const authRouter=require('./routes/auth')
const profileRouter=require('./routes/profile')
const requestRouter=require('./routes/request');
const userRouter = require('./routes/user');

app.use('/',authRouter);
app.use('/',profileRouter);
app.use('/',requestRouter)
app.use('/',userRouter);

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
    app.listen(PORT,(req,res)=>{
    console.log(`Server is listening on PORT ${PORT}...`)
})
})
.catch((err)=>console.log("Error while connecting database" , err));