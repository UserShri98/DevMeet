
const mongoose=require('mongoose');
const User=require('../models/user')

const connectionRequestSchema=new mongoose.Schema({
    fromUserId:{
      type:mongoose.Schema.Types.ObjectId,
      required:true,
      ref:User
    },
     toUserId:{
      type:mongoose.Schema.Types.ObjectId,
      required:true,
    },
    status:{
        type:String,
        required:true,
        enum:{
            values:["ignored","accepted","rejected","interested"],
            message:'{VALUE} is not accepted'
        }
    }
},
{timestamps:true}
)

connectionRequestSchema.index({toUserId:1,fromUserId:1})

connectionRequestSchema.pre("save",function(next){
   const connectionRequest=this;

   if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
     throw new Error("Cannot have same ids for both sender and receiver")

   }
   next();
})

const connectionRequestModel=mongoose.model("ConnectionRequest",connectionRequestSchema);

module.exports=connectionRequestModel;