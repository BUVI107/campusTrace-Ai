const express = require("express");

const {
    getAnalytics,
    getLocationHotspots
} = require("../controllers/analyticsController");

const protect = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/roleMiddleware");

const router = express.Router();

// ==========================================
// GET ADMIN ANALYTICS
// ==========================================

router.get(
    "/",
    protect,
    requireAdmin,
    getAnalytics
);

// ==========================================
// GET LOCATION / CAMPUS HOTSPOTS
// Available to any signed-in user so the hotspot map
// can show "where things go missing" campus-wide.
// ==========================================

router.get(
    "/hotspots",
    protect,
    getLocationHotspots
);

module.exports = router;
