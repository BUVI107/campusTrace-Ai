const mongoose = require("mongoose");

const claimSchema = new mongoose.Schema(
    {
        item: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Item",
            required: true
        },

        claimedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending"
        },

        message: {
            type: String,
            default: ""
        },

        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        reviewedAt: {
            type: Date,
            default: null
        },

        rejectionReason: {
            type: String,
            default: ""
        },

        // Generated once a claim is approved. The claimant
        // shows this QR at the front desk to verify pickup.
        pickupToken: {
            type: String,
            default: null
        },

        pickupQrImage: {
            type: String,
            default: null
        },

        pickupVerifiedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Claim", claimSchema);