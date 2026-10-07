const express = require("express");

const {
    getMyNotifications,
    markAsRead,
    markAllAsRead
} = require("../controllers/notificationController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getMyNotifications);
router.post("/:id/read", protect, markAsRead);
router.post("/read-all", protect, markAllAsRead);

module.exports = router;
