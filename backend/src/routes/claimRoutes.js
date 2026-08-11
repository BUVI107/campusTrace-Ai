const express = require("express");

const {
    createClaim,
    getMyClaims,
    getClaimById
} = require("../controllers/claimController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================================
// CREATE CLAIM
// ==========================================

router.post(
    "/",
    protect,
    createClaim
);

// ==========================================
// GET MY CLAIMS
// ==========================================

router.get(
    "/my",
    protect,
    getMyClaims
);

// ==========================================
// GET SINGLE CLAIM
// ==========================================

router.get(
    "/:id",
    protect,
    getClaimById
);

module.exports = router;