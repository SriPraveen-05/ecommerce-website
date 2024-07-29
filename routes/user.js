// routes/user.js
import express from 'express';
import { registerUser, verifyOtp, } from '../controllers/user.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/verify-otp',verifyOtp)

export default router;
