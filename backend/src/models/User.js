const mongoose = require("mongoose");


// ==========================================
// USER SCHEMA
// ==========================================

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true,
            minlength: 6
        },

        phone: {
            type: String,
            trim: true
        },

        collegeId: {
            type: String,
            trim: true
        },

        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        },

        verified: {
            type: Boolean,
            default: false
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);


// ==========================================
// EXPORT MODEL
// ==========================================

module.exports = mongoose.model("User", userSchema);