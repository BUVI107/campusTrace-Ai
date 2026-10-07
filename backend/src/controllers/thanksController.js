const Thanks = require("../models/Thanks");
const Claim = require("../models/Claim");
const Item = require("../models/Item");
const { notifyUser } = require("../services/notificationService");

// ==========================================
// SEND THANKS TO THE FINDER
// Only the claimant, and only after their claim on the
// item has been approved, and only once per claim.
// ==========================================

const sendThanks = async (req, res) => {
    try {
        const { claimId, message } = req.body;

        if (!claimId || !message || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: "claimId and a message are required"
            });
        }

        const claim = await Claim.findById(claimId).populate("item");

        if (!claim) {
            return res.status(404).json({
                success: false,
                message: "Claim not found"
            });
        }

        if (claim.claimedBy.toString() !== req.user.userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "You can only thank the finder for your own claim"
            });
        }

        if (claim.status !== "approved") {
            return res.status(400).json({
                success: false,
                message: "You can only thank the finder once your claim is approved"
            });
        }

        const existingThanks = await Thanks.findOne({ claim: claimId });

        if (existingThanks) {
            return res.status(409).json({
                success: false,
                message: "You have already thanked the finder for this item"
            });
        }

        const item = claim.item;

        const thanks = await Thanks.create({
            item: item._id,
            claim: claim._id,
            from: req.user.userId,
            to: item.reportedBy,
            message: message.trim()
        });

        await notifyUser(item.reportedBy, {
            type: "thanks-received",
            title: "Someone said thanks 💛",
            message: `The owner of "${item.title}" sent you a thank-you note.`,
            data: { itemId: item._id, thanksId: thanks._id }
        });

        return res.status(201).json({
            success: true,
            message: "Thank-you note sent to the finder",
            thanks
        });
    } catch (error) {
        console.error("Send Thanks Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while sending thanks"
        });
    }
};

// ==========================================
// GET THANKS RECEIVED (finder's inbox)
// ==========================================

const getReceivedThanks = async (req, res) => {
    try {
        const thanks = await Thanks.find({ to: req.user.userId })
            .populate("item", "title category location")
            .populate("from", "name")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: thanks.length,
            thanks
        });
    } catch (error) {
        console.error("Get Received Thanks Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while fetching thanks"
        });
    }
};

// ==========================================
// GET THANKS SENT (claimant's own history, used to
// know which approved claims already have a thanks)
// ==========================================

const getSentThanks = async (req, res) => {
    try {
        const thanks = await Thanks.find({ from: req.user.userId });

        return res.status(200).json({
            success: true,
            count: thanks.length,
            thanks
        });
    } catch (error) {
        console.error("Get Sent Thanks Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while fetching thanks"
        });
    }
};

module.exports = { sendThanks, getReceivedThanks, getSentThanks };
