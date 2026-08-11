const Claim = require("../models/Claim");
const Item = require("../models/Item");

// ==========================================
// CREATE CLAIM
// ==========================================

const createClaim = async (req, res) => {
    try {
        const { itemId } = req.body;

        if (!itemId) {
            return res.status(400).json({
                success: false,
                message: "itemId is required"
            });
        }

        const item = await Item.findById(itemId);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Item not found"
            });
        }

        // Don't allow claiming your own item
        if (item.reportedBy.toString() === req.user.userId.toString()) {
            return res.status(400).json({
                success: false,
                message: "You cannot claim your own reported item"
            });
        }

        // Check if user already claimed this item
        const existingClaim = await Claim.findOne({
            item: itemId,
            claimedBy: req.user.userId
        });

        if (existingClaim) {
            return res.status(409).json({
                success: false,
                message: "You have already submitted a claim for this item"
            });
        }

        const claim = await Claim.create({
            item: itemId,
            claimedBy: req.user.userId,
            status: "pending"
        });

        return res.status(201).json({
            success: true,
            message: "Claim submitted successfully",
            claim
        });

    } catch (error) {
        console.error("Create Claim Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while creating claim"
        });
    }
};


// ==========================================
// GET MY CLAIMS
// ==========================================

const getMyClaims = async (req, res) => {
    try {
        const claims = await Claim.find({
            claimedBy: req.user.userId
        })
            .populate("item")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: claims.length,
            claims
        });

    } catch (error) {
        console.error("Get My Claims Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while fetching your claims"
        });
    }
};


// ==========================================
// GET SINGLE CLAIM
// ==========================================

const getClaimById = async (req, res) => {
    try {
        const claim = await Claim.findById(req.params.id)
            .populate("item")
            .populate("claimedBy", "name email phone");

        if (!claim) {
            return res.status(404).json({
                success: false,
                message: "Claim not found"
            });
        }

        return res.status(200).json({
            success: true,
            claim
        });

    } catch (error) {
        console.error("Get Claim Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while fetching claim"
        });
    }
};


// ==========================================
// EXPORTS
// ==========================================

module.exports = {
    createClaim,
    getMyClaims,
    getClaimById
};