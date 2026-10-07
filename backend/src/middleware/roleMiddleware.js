const User = require("../models/User");

// =====================================================
// REQUIRE ADMIN ROLE
// Runs after `protect`. The JWT only carries a userId, so
// the role is looked up fresh from the database — this
// also means revoking admin access takes effect immediately
// without needing to invalidate existing tokens.
// =====================================================

const requireAdmin = async (req, res, next) => {
    try {
        if (!req.user || !req.user.userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const user = await User.findById(req.user.userId).select("role");

        if (!user || user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Admin access required"
            });
        }

        next();
    } catch (error) {
        console.error("Role Middleware Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while checking permissions"
        });
    }
};

module.exports = requireAdmin;
