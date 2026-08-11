const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");


// ==========================================
// GENERATE JWT TOKEN
// ==========================================

const generateToken = (userId) => {
    return jwt.sign(
        {
            userId: userId.toString()
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );
};


// ==========================================
// REGISTER USER
// ==========================================

const register = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            phone,
            collegeId
        } = req.body;


        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required"
            });
        }


        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least 6 characters"
            });
        }


        // Check existing user
        const existingUser = await User.findOne({
            email: email.toLowerCase().trim()
        });


        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists"
            });
        }


        // Hash password
        const hashedPassword = await bcrypt.hash(
            password,
            12
        );


        // Create user
        const user = await User.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            phone,
            collegeId
        });


        // Generate JWT
        const token = generateToken(user._id);


        // Response
        return res.status(201).json({
            success: true,
            message: "Account created successfully",

            token,

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                verified: user.verified
            }
        });

    } catch (error) {

        console.error("Register Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error during registration"
        });
    }
};


// ==========================================
// LOGIN USER
// ==========================================

const login = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;


        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }


        // Find user
        const user = await User.findOne({
            email: email.toLowerCase().trim()
        });


        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }


        // Compare password
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );


        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }


        // Generate JWT
        const token = generateToken(user._id);


        // Response
        return res.status(200).json({
            success: true,
            message: "Login successful",

            token,

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                verified: user.verified
            }
        });

    } catch (error) {

        console.error("Login Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error during login"
        });
    }
};


// ==========================================
// GET CURRENT USER
// ==========================================

const getMe = async (req, res) => {
    try {

        const user = await User.findById(
            req.user.userId
        ).select("-password");


        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }


        return res.status(200).json({
            success: true,
            user
        });

    } catch (error) {

        console.error("Get Me Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ==========================================
// EXPORT CONTROLLERS
// ==========================================

module.exports = {
    register,
    login,
    getMe
};