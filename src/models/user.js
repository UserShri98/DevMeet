const mongoose = require("mongoose");
const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt');


const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:4
    },
     lastName:{
        type:String,
        required:true
    },
     age:{
        type:Number,
    },
     email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
},{
    timestamps:true
})

userSchema.methods.getJWT=async function(req,res){
    const user=this;

    const token=await jwt.sign({_id:user._id},"devmeet",{expiresIn:"7d"})

    
return token;
}

// userSchema.methods.comparePasswords=async function(){
//    const user=this;

//     const newPassword= await bcrypt.compare(password,user.password)

//     return newPassword;
// }


module.exports=mongoose.model("User",userSchema);

