const express=require('express');
const app=express();
const connectDB=require('./config/db')
const cookieParser = require('cookie-parser');
const cors=require('cors')

// CORS configuration - allow both development and production origins
app.use(cors({
    origin: ['http://localhost:5173', 'http://16.171.30.18'],
    credentials:true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())
app.use(cookieParser())

const authRouter=require('./routes/auth')
const profileRouter=require('./routes/profile')
const requestRouter=require('./routes/request');
const userRouter = require('./routes/user');

// Mount all routes under /api prefix
app.use('/api',authRouter);
app.use('/api',profileRouter);
app.use('/api',requestRouter)
app.use('/api',userRouter)

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


