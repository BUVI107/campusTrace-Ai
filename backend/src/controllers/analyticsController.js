const User = require("../models/User");
const Item = require("../models/Item");
const Claim = require("../models/Claim");

// ==========================================
// GET ADMIN ANALYTICS
// ==========================================

const getAnalytics = async (req, res) => {
    try {
        // -----------------------------
        // USER STATISTICS
        // -----------------------------

        const totalUsers = await User.countDocuments();

        // -----------------------------
        // ITEM STATISTICS
        // -----------------------------

        const totalItems = await Item.countDocuments();

        const lostItems = await Item.countDocuments({
            type: "lost"
        });

        const foundItems = await Item.countDocuments({
            type: "found"
        });

        const activeItems = await Item.countDocuments({
            status: "active"
        });

        const matchedItems = await Item.countDocuments({
            status: "matched"
        });

        const claimedItems = await Item.countDocuments({
            status: "claimed"
        });

        const returnedItems = await Item.countDocuments({
            status: "returned"
        });

        // -----------------------------
        // CLAIM STATISTICS
        // -----------------------------

        const totalClaims = await Claim.countDocuments();

        const pendingClaims = await Claim.countDocuments({
            status: "pending"
        });

        const approvedClaims = await Claim.countDocuments({
            status: "approved"
        });

        const rejectedClaims = await Claim.countDocuments({
            status: "rejected"
        });

        // -----------------------------
        // RESPONSE
        // -----------------------------

        return res.status(200).json({
            success: true,

            analytics: {
                users: {
                    total: totalUsers
                },

                items: {
                    total: totalItems,
                    lost: lostItems,
                    found: foundItems,
                    active: activeItems,
                    matched: matchedItems,
                    claimed: claimedItems,
                    returned: returnedItems
                },

                claims: {
                    total: totalClaims,
                    pending: pendingClaims,
                    approved: approvedClaims,
                    rejected: rejectedClaims
                }
            }
        });

    } catch (error) {
        console.error("Get Analytics Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while fetching analytics"
        });
    }
};

// ==========================================
// EXPORTS
// ==========================================

module.exports = {
    getAnalytics
};