const express = require("express");

const {
    sendThanks,
    getReceivedThanks,
    getSentThanks
} = require("../controllers/thanksController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, sendThanks);
router.get("/received", protect, getReceivedThanks);
router.get("/sent", protect, getSentThanks);

module.exports = router;
