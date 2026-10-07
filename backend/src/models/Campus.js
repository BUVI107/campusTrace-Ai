const mongoose = require("mongoose");

// =====================================================
// CAMPUS SCHEMA
// A campus contains one or more buildings. Items are
// reported against a campus + optional building so that
// matching and hotspot analytics can be scoped correctly
// once CampusTrace runs across more than one campus.
// =====================================================

const campusSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        code: {
            type: String,
            required: true,
            trim: true,
            uppercase: true,
            unique: true
        },

        buildings: [
            {
                name: {
                    type: String,
                    required: true,
                    trim: true
                }
            }
        ],

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Campus", campusSchema);
