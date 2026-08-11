const Claim = require("../models/Claim");
const Item = require("../models/Item");

// ==========================================
// GET ALL PENDING CLAIMS
// ==========================================

const getPendingClaims = async (req, res) => {
    try {
        const claims = await Claim.find({
            status: "pending"
        })
            .populate("item")
            .populate("claimedBy", "name email phone collegeId")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: claims.length,
            claims
        });

    } catch (error) {
        console.error("Get Pending Claims Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while fetching pending claims"
        });
    }
};

// ==========================================
// APPROVE CLAIM
// ==========================================

const approveClaim = async (req, res) => {
    try {
        const { claimId } = req.params;

        const claim = await Claim.findById(claimId);

        if (!claim) {
            return res.status(404).json({
                success: false,
                message: "Claim not found"
            });
        }

        // Prevent approving an already processed claim
        if (claim.status !== "pending") {
            return res.status(400).json({
                success: false,
                message: `Claim is already ${claim.status}`
            });
        }

        // Approve claim
        claim.status = "approved";
        claim.reviewedBy = req.user.userId;
        claim.reviewedAt = new Date();

        await claim.save();

        // Mark the item as resolved
        await Item.findByIdAndUpdate(
            claim.item,
            {
                status: "resolved"
            }
        );

        const updatedClaim = await Claim.findById(claim._id)
            .populate("item")
            .populate("claimedBy", "name email phone collegeId")
            .populate("reviewedBy", "name email");

        return res.status(200).json({
            success: true,
            message: "Claim approved successfully",
            claim: updatedClaim
        });

    } catch (error) {
        console.error("Approve Claim Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while approving claim"
        });
    }
};

// ==========================================
// REJECT CLAIM
// ==========================================

const rejectClaim = async (req, res) => {
    try {
        const { claimId } = req.params;

        const { rejectionReason } = req.body;

        const claim = await Claim.findById(claimId);

        if (!claim) {
            return res.status(404).json({
                success: false,
                message: "Claim not found"
            });
        }

        // Prevent rejecting an already processed claim
        if (claim.status !== "pending") {
            return res.status(400).json({
                success: false,
                message: `Claim is already ${claim.status}`
            });
        }

        // Reject claim
        claim.status = "rejected";
        claim.reviewedBy = req.user.userId;
        claim.reviewedAt = new Date();
        claim.rejectionReason = rejectionReason || "";

        await claim.save();

        const updatedClaim = await Claim.findById(claim._id)
            .populate("item")
            .populate("claimedBy", "name email phone collegeId")
            .populate("reviewedBy", "name email");

        return res.status(200).json({
            success: true,
            message: "Claim rejected successfully",
            claim: updatedClaim
        });

    } catch (error) {
        console.error("Reject Claim Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while rejecting claim"
        });
    }
};

// ==========================================
// EXPORTS
// ==========================================

module.exports = {
    getPendingClaims,
    approveClaim,
    rejectClaim
};