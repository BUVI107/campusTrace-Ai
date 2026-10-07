const express = require("express");

const {
    getCampuses,
    createCampus,
    addBuilding
} = require("../controllers/campusController");

const protect = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/roleMiddleware");

const router = express.Router();

// ==========================================
// LIST CAMPUSES
// ==========================================

router.get("/", protect, getCampuses);

// ==========================================
// CREATE CAMPUS (admin)
// ==========================================

router.post("/", protect, requireAdmin, createCampus);

// ==========================================
// ADD BUILDING TO CAMPUS (admin)
// ==========================================

router.post(
    "/:campusId/buildings",
    protect,
    requireAdmin,
    addBuilding
);

module.exports = router;
