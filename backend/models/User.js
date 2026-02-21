import mongoose from 'mongoose';

const userSchema=new mongoose.Schema({
    name:{type:String,require:true},
    email:{type:String,require:true,unique:true},
     phone:{type:String,require:true,unique:true,sparse: true},
     password:{type:String,require:true},
     emailVerified:{type:Boolean,default:false},
     phoneVerified:{type:Boolean,default:false},
     emailOtp:String,
     phoneOtp:String,
     otpExpiry:Date
})

export default mongoose.model("User",userSchema);