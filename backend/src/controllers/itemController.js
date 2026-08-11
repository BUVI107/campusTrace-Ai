const Item = require("../models/Item");
const { findMatches } = require("../services/aiMatchService");

// ==========================================
// CREATE LOST / FOUND ITEM
// ==========================================

const createItem = async (req, res) => {
    try {
        const {
            type,
            title,
            description,
            category,
            color,
            brand,
            location,
            latitude,
            longitude,
            reportedAt
        } = req.body;

        // ==========================================
        // VALIDATION
        // ==========================================

        if (
            !type ||
            !title ||
            !description ||
            !category ||
            !location
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Type, title, description, category and location are required"
            });
        }

        // ==========================================
        // VALIDATE TYPE
        // ==========================================

        if (!["lost", "found"].includes(type)) {
            return res.status(400).json({
                success: false,
                message: "Type must be either lost or found"
            });
        }

        // ==========================================
        // CREATE ITEM
        // ==========================================

        const item = await Item.create({
            type,
            title,
            description,
            category,
            color,
            brand,
            location,

            coordinates: {
                latitude:
                    latitude !== undefined
                        ? Number(latitude)
                        : undefined,

                longitude:
                    longitude !== undefined
                        ? Number(longitude)
                        : undefined
            },

            reportedAt: reportedAt || new Date(),

            reportedBy: req.user.userId
        });

        // ==========================================
        // AI MATCHING
        // ==========================================

        let matchResult = {
            totalMatches: 0,
            matches: []
        };

        try {
            matchResult = await findMatches(item._id);

            // Update match status
            if (matchResult.totalMatches > 0) {
                item.matchStatus = "match-found";
            } else {
                item.matchStatus = "no-match";
            }

            await item.save();

        } catch (matchError) {
            console.error(
                "AI Matching Error:",
                matchError
            );

            // Do NOT fail item creation
            item.matchStatus = "pending";

            await item.save();
        }

        // ==========================================
        // RESPONSE
        // ==========================================

        return res.status(201).json({
            success: true,

            message:
                type === "lost"
                    ? "Lost item reported successfully"
                    : "Found item reported successfully",

            item,

            aiMatching: {
                totalMatches: matchResult.totalMatches,
                matches: matchResult.matches
            }
        });

    } catch (error) {
        console.error(
            "Create Item Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Server error while creating item"
        });
    }
};


// ==========================================
// GET ALL ITEMS
// ==========================================

const getItems = async (req, res) => {
    try {
        const {
            type,
            category,
            status
        } = req.query;

        const filter = {};

        if (type) {
            filter.type = type;
        }

        if (category) {
            filter.category = category;
        }

        filter.status = status || "active";

        const items = await Item.find(filter)
            .populate(
                "reportedBy",
                "name email"
            )
            .sort({
                createdAt: -1
            });

        return res.status(200).json({
            success: true,
            count: items.length,
            items
        });

    } catch (error) {
        console.error(
            "Get Items Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Server error while fetching items"
        });
    }
};


// ==========================================
// GET SINGLE ITEM
// ==========================================

const getItemById = async (req, res) => {
    try {
        const item = await Item.findById(
            req.params.id
        ).populate(
            "reportedBy",
            "name email"
        );

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Item not found"
            });
        }

        return res.status(200).json({
            success: true,
            item
        });

    } catch (error) {
        console.error(
            "Get Item Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Server error while fetching item"
        });
    }
};


// ==========================================
// GET MY ITEMS
// ==========================================

const getMyItems = async (req, res) => {
    try {
        const items = await Item.find({
            reportedBy: req.user.userId
        })
            .sort({
                createdAt: -1
            });

        return res.status(200).json({
            success: true,
            count: items.length,
            items
        });

    } catch (error) {
        console.error(
            "Get My Items Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Server error while fetching your items"
        });
    }
};


// ==========================================
// GET AI MATCHES FOR ITEM
// ==========================================

const getItemMatches = async (req, res) => {
    try {
        const result = await findMatches(
            req.params.id
        );

        return res.status(200).json({
            success: true,
            ...result
        });

    } catch (error) {
        console.error(
            "Get Item Matches Error:",
            error
        );

        if (
            error.message ===
            "Item not found"
        ) {
            return res.status(404).json({
                success: false,
                message: "Item not found"
            });
        }

        return res.status(500).json({
            success: false,
            message:
                "Server error while finding matches"
        });
    }
};


// ==========================================
// EXPORTS
// ==========================================

module.exports = {
    createItem,
    getItems,
    getItemById,
    getMyItems,
    getItemMatches
};