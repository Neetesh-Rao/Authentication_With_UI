import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { generateOTP } from '../utils/generateOTP.js';
import { sendEmail } from '../utils/sendEmail.js';
import { sendSMS } from '../utils/sendSMS.js';
import User from '../models/User.js';


export const completeRegistration=async(req,res)=>{
    const {name,email,phone,password}=req.body;
    try{
    const user=await User.findOne({email});
    if(!user){
            return res.status(404).json({ message: "User not found. Please verify email & phone first." });
    }
    if (!user.emailVerified || !user.phoneVerified) {
      return res.status(400).json({ message: "Please verify email and phone first." });
    }
     if (user.password) {
      return res.status(400).json({
        message: "User already registered. Please login."
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update same user
    user.name = name;
    user.password = hashedPassword;
    // user.emailVerified=true;
    // user.emailVerified = true;

    await user.save();
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );


    res.status(200).json({
      message: "Registration completed successfully",
       token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      }
    });
    }catch(err){
          res.status(500).json({ message: err.message });
    }
}



export const sendEmailOtp = async (req, res) => {
  const { email } = req.body;
  
 
  
  

  try {
    let user = await User.findOne({ email });
     
     
    if (user && user.emailVerified) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const otp = generateOTP();
    // console.log(otp);
    

    if (!user) {
      user = new User({ email });
    }
    // console.log(email)

    user.emailOtp = otp;
    user.otpExpiry = new Date(Date.now() + 5 * 60000);
   
    
    await user.save();
    
    await sendEmail(email, "Your Email OTP", `Your OTP is: ${otp}`);
   
     console.log('2')
    return res.json({ message: "OTP sent to email" });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


export const verifyEmailOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.emailOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpiry < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    
    user.emailOtp = null;
    user.otpExpiry = null;
user.emailVerified = true;
    await user.save();

    return res.json({ message: "Email verified successfully" });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


export const sendPhoneOtp = async (req, res) => {
  const { email,phone } = req.body;
  // console.log(req.body);
  
  try {
    const user = await User.findOne({ email });
    // console.log(user)

    if (!user || !user.emailVerified) {
      return res.status(400).json({ message: "Verify email first" });
    }
    
    

    const otp = generateOTP();
    // console.log(otp);
    
    user.phone = phone;
    user.phoneOtp = otp;
    user.otpExpiry = new Date(Date.now() + 5 * 60000);
    // console.log(user);

    
    await user.save();
    
    
    
    await sendSMS(phone, `Your OTP is ${otp}`);

    return res.json({ message: "OTP sent to phone" });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


export const verifyPhoneOtp = async (req, res) => {
  const { phone, otp } = req.body;

  try {
    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.phoneOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpiry < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    
    user.phoneOtp = null;
    user.otpExpiry = null;
user.phoneVerified = true;
    await user.save();

    return res.json({ message: "Phone verified successfully" });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


export const loginUser=async(req,res)=>{
    const{identifier,password}=req.body;
   
    try{
const user=await User.findOne({
    $or:[{email:identifier},{phone:identifier}]
})
if(!user){
    return res.status(400).json({ message: "User not found" });
}
  if (!user.password) {
      return res.status(400).json({ message: "Please complete registration first" });
    }
    const isMatch=await bcrypt.compare(password,user.password)
    if(!isMatch){
           return res.status(400).json({ message: "Invalid password" });
    }
    const token=jwt.sign(
        {id:user._id},
        process.env.JWT_SECRET,
        {expiresIn:"1d"}
    )

 res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });

    }catch(err){
  res.status(500).json({ message: err.message });
    }
}

// GET /api/auth/get-verification-status?email=test@example.com
export const getVerificationStatus = async (req, res) => {
  try {
    const { email } = req.query;
    if(!email){
      return res.status(400).json({ message: "Email is required" });
    }
    const user = await User.findOne({ email });
    if(!user){
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      emailVerified: user.emailVerified,
      phoneVerified: user.phoneVerified
    });
  } catch(err){
    res.status(500).json({ message: err.message });
  }
};
