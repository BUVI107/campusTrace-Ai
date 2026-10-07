const Item = require("../models/Item");
const { findMatches } = require("../services/aiMatchService");
const { hashImageFile } = require("../utils/imageHash");
const { generateToken, generateQrDataUrl } = require("../utils/qrCode");
const { notifyUser } = require("../services/notificationService");

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
            reportedAt,
            campus,
            building
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
        // UPLOADED PHOTOS (optional, up to 4)
        // ==========================================

        const uploadedFiles = req.files || [];

        const images = uploadedFiles.map(
            (file) => `/uploads/items/${file.filename}`
        );

        const imageHashes = [];

        for (const file of uploadedFiles) {
            const hash = await hashImageFile(file.path);

            if (hash) {
                imageHashes.push(hash);
            }
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
            campus: campus || null,
            building: building || "",

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

            images,
            imageHashes,

            reportedBy: req.user.userId
        });

        // ==========================================
        // QR TAG AT REPORT TIME (found items only)
        // Lets whoever hands the item in print/attach a
        // tag immediately, instead of waiting until
        // someone claims it.
        // ==========================================

        if (type === "found") {
            const qrToken = generateToken();

            const qrCodeImage = await generateQrDataUrl({
                itemId: item._id.toString(),
                qrToken
            });

            item.qrToken = qrToken;
            item.qrCodeImage = qrCodeImage;
        }

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
        // NOTIFY REPORTERS OF THE STRONGEST MATCH
        // ==========================================

        if (matchResult.matches.length > 0) {
            const topMatch = matchResult.matches[0];

            await notifyUser(item.reportedBy, {
                type: "match-found",
                title: "We found a possible match 🎯",
                message: `Your ${type} report "${item.title}" has a ${topMatch.matchScore}% match with "${topMatch.title}".`,
                data: { itemId: item._id, matchedItemId: topMatch.itemId }
            });

            if (topMatch.reportedBy?._id) {
                await notifyUser(topMatch.reportedBy._id, {
                    type: "match-found",
                    title: "We found a possible match 🎯",
                    message: `A new report "${item.title}" has a ${topMatch.matchScore}% match with your item "${topMatch.title}".`,
                    data: { itemId: topMatch.itemId, matchedItemId: item._id }
                });
            }
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
            .populate("campus", "name code")
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
        )
            .populate(
                "reportedBy",
                "name email"
            )
            .populate("campus", "name code");

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
            .populate("campus", "name code")
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
// GET REPORT-TIME QR FOR A FOUND ITEM
// ==========================================

const getItemQr = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id).select(
            "type title qrToken qrCodeImage reportedBy"
        );

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Item not found"
            });
        }

        if (item.type !== "found") {
            return res.status(400).json({
                success: false,
                message: "Only found items have a report-time QR tag"
            });
        }

        if (item.reportedBy.toString() !== req.user.userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "You can only view the QR tag for your own report"
            });
        }

        return res.status(200).json({
            success: true,
            qrToken: item.qrToken,
            qrCodeImage: item.qrCodeImage
        });
    } catch (error) {
        console.error("Get Item QR Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while fetching QR tag"
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
    getItemMatches,
    getItemQr
};