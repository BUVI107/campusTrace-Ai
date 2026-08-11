const express = require("express");

const {
    getPendingClaims,
    approveClaim,
    rejectClaim
} = require("../controllers/adminController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================================
// GET PENDING CLAIMS
// ==========================================

router.get(
    "/claims/pending",
    protect,
    getPendingClaims
);

// ==========================================
// APPROVE CLAIM
// ==========================================

router.post(
    "/claims/:claimId/approve",
    protect,
    approveClaim
);

// ==========================================
// REJECT CLAIM
// ==========================================

router.post(
    "/claims/:claimId/reject",
    protect,
    rejectClaim
);

module.exports = router;