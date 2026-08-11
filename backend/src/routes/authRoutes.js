const express = require("express");

const {
    register,
    login,
    getMe
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// ==========================================
// REGISTER
// ==========================================

router.post(
    "/register",
    register
);


// ==========================================
// LOGIN
// ==========================================

router.post(
    "/login",
    login
);


// ==========================================
// CURRENT USER
// ==========================================

router.get(
    "/me",
    protect,
    getMe
);


// ==========================================
// EXPORT ROUTER
// ==========================================

module.exports = router;