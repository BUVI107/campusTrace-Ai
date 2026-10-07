const mongoose = require("mongoose");

// =====================================================
// THANKS SCHEMA
// A free, reward-free thank-you note sent from the person
// who lost an item to the person who found and handed it
// in, once a claim on that item has been approved.
// =====================================================

const thanksSchema = new mongoose.Schema(
    {
        item: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Item",
            required: true
        },

        claim: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Claim",
            required: true,
            unique: true
        },

        from: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        to: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        message: {
            type: String,
            required: true,
            trim: true,
            maxlength: 500
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Thanks", thanksSchema);
