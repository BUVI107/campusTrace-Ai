const mongoose = require("mongoose");

// =====================================================
// NOTIFICATION SCHEMA
// Persisted record of every real-time/email notification
// sent to a user, so the bell icon has history even if the
// user was offline when the socket event fired.
// =====================================================

const notificationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        type: {
            type: String,
            enum: [
                "match-found",
                "new-claim",
                "claim-approved",
                "claim-rejected",
                "thanks-received"
            ],
            required: true
        },

        title: {
            type: String,
            required: true
        },

        message: {
            type: String,
            required: true
        },

        data: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        },

        read: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Notification", notificationSchema);
