const express = require("express");

const {
    createItem,
    getItems,
    getItemById,
    getMyItems,
    getItemMatches
} = require("../controllers/itemController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// ==========================================
// CREATE LOST / FOUND ITEM
// ==========================================

router.post(
    "/",
    protect,
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
// GET SINGLE ITEM
// ==========================================

router.get(
    "/:id",
    protect,
    getItemById
);


module.exports = router;