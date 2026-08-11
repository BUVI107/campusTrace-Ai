const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema(
    {
        date: {
            type: Date,
            required: true,
            unique: true
        },

        totalUsers: {
            type: Number,
            default: 0
        },

        totalItems: {
            type: Number,
            default: 0
        },

        lostItems: {
            type: Number,
            default: 0
        },

        foundItems: {
            type: Number,
            default: 0
        },

        activeItems: {
            type: Number,
            default: 0
        },

        matchedItems: {
            type: Number,
            default: 0
        },

        claimedItems: {
            type: Number,
            default: 0
        },

        returnedItems: {
            type: Number,
            default: 0
        },

        totalClaims: {
            type: Number,
            default: 0
        },

        pendingClaims: {
            type: Number,
            default: 0
        },

        approvedClaims: {
            type: Number,
            default: 0
        },

        rejectedClaims: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Analytics", analyticsSchema);