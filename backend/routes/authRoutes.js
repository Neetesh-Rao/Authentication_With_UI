import express from 'express';
import { sendPhoneOtp,verifyPhoneOtp,sendEmailOtp,verifyEmailOtp,completeRegistration,loginUser,getVerificationStatus } from '../controllers/authControllers.js';

const router=express.Router();

router.post("/complete-registration", completeRegistration);
router.post("/send-email-otp",sendEmailOtp);
router.post("/verify-email-otp",verifyEmailOtp);
router.post("/send-phone-otp",sendPhoneOtp);
router.post("/verify-phone-otp",verifyPhoneOtp);
router.post("/login", loginUser);
router.get("/get-verification-status", getVerificationStatus);







export default router;
