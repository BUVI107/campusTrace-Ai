const Notification = require("../models/Notification");

// ==========================================
// GET MY NOTIFICATIONS
// ==========================================

const getMyNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({
            user: req.user.userId
        })
            .sort({ createdAt: -1 })
            .limit(50);

        const unreadCount = await Notification.countDocuments({
            user: req.user.userId,
            read: false
        });

        return res.status(200).json({
            success: true,
            count: notifications.length,
            unreadCount,
            notifications
        });
    } catch (error) {
        console.error("Get Notifications Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while fetching notifications"
        });
    }
};

// ==========================================
// MARK ONE NOTIFICATION AS READ
// ==========================================

const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, user: req.user.userId },
            { read: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found"
            });
        }

        return res.status(200).json({
            success: true,
            notification
        });
    } catch (error) {
        console.error("Mark Notification Read Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while updating notification"
        });
    }
};

// ==========================================
// MARK ALL AS READ
// ==========================================

const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { user: req.user.userId, read: false },
            { read: true }
        );

        return res.status(200).json({
            success: true,
            message: "All notifications marked as read"
        });
    } catch (error) {
        console.error("Mark All Notifications Read Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while updating notifications"
        });
    }
};

module.exports = { getMyNotifications, markAsRead, markAllAsRead };
