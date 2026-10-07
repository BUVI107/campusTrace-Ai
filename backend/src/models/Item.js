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

        // Multi-campus / multi-building support
        campus: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Campus",
            default: null
        },

        building: {
            type: String,
            trim: true,
            default: ""
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

        // Perceptual hash (one per image) used for
        // photo-based AI matching, in addition to the
        // text/location matching already in place.
        imageHashes: [
            {
                type: String
            }
        ],

        // A found item gets a QR tag the moment it is
        // reported, so staff can print/attach it right
        // away instead of waiting until pickup.
        qrToken: {
            type: String,
            default: null
        },

        qrCodeImage: {
            type: String,
            default: null
        },

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