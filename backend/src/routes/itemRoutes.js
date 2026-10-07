const express = require("express");

const {
    createItem,
    getItems,
    getItemById,
    getMyItems,
    getItemMatches,
    getItemQr
} = require("../controllers/itemController");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();


// ==========================================
// CREATE LOST / FOUND ITEM (up to 4 photos)
// ==========================================

router.post(
    "/",
    protect,
    upload.array("images", 4),
    createItem
);


// ==========================================
// GET MY ITEMS
// ==========================================

router.get(
    "/my",
    protect,
    getMyItems
);


// ==========================================
// GET ALL ITEMS
// ==========================================

router.get(
    "/",
    protect,
    getItems
);


// ==========================================
// GET AI MATCHES
// ==========================================

router.get(
    "/:id/matches",
    protect,
    getItemMatches
);


// ==========================================
// GET REPORT-TIME QR TAG (found items)
// ==========================================

router.get(
    "/:id/qr",
    protect,
    getItemQr
);


// ==========================================
// GET SINGLE ITEM
// ==========================================

router.get(
    "/:id",
    protect,
    getItemById
);


module.exports = router;
