const mongoose = require("mongoose");
const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt');
const validator=require('validator')

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
    gender:{
     type:String,
    validate(value){
     if(!["male","female","others"].includes(value)){
        throw new Error("Gender data is not valid")
     }
    }
    },
    photoUrl:{
        type:String,
        default:"https://t3.ftcdn.net/jpg/05/87/76/66/360_F_587766653_PkBNyGx7mQh9l1XXPtCAq1lBgOsLl6xH.jpg",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid photo URL")
            }
        }
    },
    about:{
        type:String,
        default:"This is default about of the user"
    },
    skills:{
        type:[String]
    }
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

