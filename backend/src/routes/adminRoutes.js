const express = require("express");

const {
    getPendingClaims,
    approveClaim,
    rejectClaim
} = require("../controllers/adminController");

const protect = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(protect, requireAdmin);

// ==========================================
// GET PENDING CLAIMS
// ==========================================

router.get(
    "/claims/pending",
    getPendingClaims
);

// ==========================================
// APPROVE CLAIM
// ==========================================

router.post(
    "/claims/:claimId/approve",
    approveClaim
);

// ==========================================
// REJECT CLAIM
// ==========================================

router.post(
    "/claims/:claimId/reject",
    rejectClaim
);

module.exports = router;
