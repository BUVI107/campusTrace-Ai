const Notification = require("../models/Notification");
const User = require("../models/User");
const { getIO } = require("../config/socket");
const { sendMail } = require("../utils/mailer");

// =====================================================
// EMAIL TEMPLATES (kept short and plain)
// =====================================================

const buildEmailHtml = (title, message) => `
    <div style="font-family: sans-serif; color: #2E2222;">
        <h2 style="color:#594545; margin-bottom: 6px;">${title}</h2>
        <p style="color:#3a2e2e; font-size: 15px; line-height: 1.5;">${message}</p>
        <p style="color:#7A5B5B; font-size: 13px; margin-top: 24px;">— CampusTrace AI</p>
    </div>
`;

// =====================================================
// NOTIFY A SINGLE USER
// Saves a Notification doc, pushes it live over the
// user's socket room if they're connected, and sends a
// best-effort email in parallel. Never throws — a failed
// notification should not fail the calling request.
// =====================================================

const notifyUser = async (userId, { type, title, message, data = {} }) => {
    if (!userId) {
        return null;
    }

    try {
        const notification = await Notification.create({
            user: userId,
            type,
            title,
            message,
            data
        });

        const io = getIO();

        if (io) {
            io.to(`user:${userId}`).emit("notification", {
                id: notification._id,
                type,
                title,
                message,
                data,
                createdAt: notification.createdAt
            });
        }

        // Fire-and-forget email; do not block the response on SMTP.
        User.findById(userId)
            .select("email name")
            .then((user) => {
                if (user?.email) {
                    sendMail({
                        to: user.email,
                        subject: title,
                        html: buildEmailHtml(title, message)
                    });
                }
            })
            .catch(() => {});

        return notification;
    } catch (error) {
        console.error("Notify User Error:", error.message);
        return null;
    }
};

module.exports = { notifyUser };
