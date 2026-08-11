const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ["lost", "found"],
            required: true
        },

        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        category: {
            type: String,
            required: true,
            enum: [
                "wallet",
                "phone",
                "laptop",
                "id-card",
                "keys",
                "bag",
                "watch",
                "earphones",
                "documents",
                "accessories",
                "other"
            ]
        },

        color: {
            type: String,
            trim: true
        },

        brand: {
            type: String,
            trim: true
        },

        location: {
            type: String,
            required: true,
            trim: true
        },

        coordinates: {
            latitude: {
                type: Number
            },
            longitude: {
                type: Number
            }
        },

        reportedAt: {
            type: Date,
            default: Date.now
        },

        images: [
            {
                type: String
            }
        ],

        status: {
            type: String,
            enum: [
                "active",
                "matched",
                "claimed",
                "returned",
                "closed"
            ],
            default: "active"
        },

        reportedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        matchStatus: {
            type: String,
            enum: [
                "pending",
                "match-found",
                "no-match"
            ],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Item", itemSchema);