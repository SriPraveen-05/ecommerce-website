// controllers/authController.js
import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendMail from "../middleware/sendMail.js";
//new user registeration
export const registerUser = async (req, res) => {
    try {
        const { name, email, password, contact } = req.body;

        // Check if email address already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: "User email already exists",
            });
        }

        // Convert raw password to hashed password
        const hashPassword = await bcrypt.hash(password, 10);

        // Generate OTP
        const otp = Math.floor(Math.random() * 1000000);

        // Create new user data
        const newUser = new User({ name, email, password: hashPassword, contact });

        // Save the new user to the database
        await newUser.save();

        // Create signed activation token
        const activationToken = jwt.sign({ user: { name, email, contact }, otp }, process.env.ACTIVATION_SECRET, {
            expiresIn: "15m",
        });

        // Send Email to user
        const message = `Please verify your account using OTP. Your OTP is ${otp}`;
        await sendMail(email, "Welcome", message);

        res.status(200).json({
            message: "OTP sent to your mail",
            activationToken
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

//verify otp
export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Find user by email
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "User not found",
            });
        }

        // Check if OTP is correct
        if (user.otp !== otp) {
            return res.status(400).json({
                message: "Wrong OTP",
            });
        }

        // OTP is correct, clear OTP from user data
        user.otp = null;
        await user.save();

        res.status(200).json({
            message: "User registration successful",
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

