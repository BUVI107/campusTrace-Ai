require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const path = require("path");

const connectDB = require("./config/db");
const { initSocket } = require("./config/socket");

// =====================================
// ROUTES
// =====================================

const authRoutes = require("./routes/authRoutes");
const itemRoutes = require("./routes/itemRoutes");
const claimRoutes = require("./routes/claimRoutes");
const adminRoutes = require("./routes/adminRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const campusRoutes = require("./routes/campusRoutes");
const thanksRoutes = require("./routes/thanksRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

// =====================================
// APP
// =====================================

const app = express();

// =====================================
// DATABASE
// =====================================

connectDB();

// =====================================
// HTTP SERVER + SOCKET.IO
// =====================================

const server = http.createServer(app);

initSocket(server);

// =====================================
// MIDDLEWARE
// =====================================

app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true
    })
);

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);

// Serve uploaded item photos
app.use(
    "/uploads",
    express.static(path.join(__dirname, "..", "uploads"))
);

// =====================================
// API ROUTES
// =====================================

// Authentication
app.use("/api/auth", authRoutes);

// Lost & Found Items
app.use("/api/items", itemRoutes);

// Claims
app.use("/api/claims", claimRoutes);

// Admin
app.use("/api/admin", adminRoutes);

// Analytics
app.use("/api/analytics", analyticsRoutes);

// Campuses / buildings
app.use("/api/campuses", campusRoutes);

// Thank-the-finder
app.use("/api/thanks", thanksRoutes);

// Notifications
app.use("/api/notifications", notificationRoutes);

// =====================================
// ROOT ROUTE
// =====================================

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "CampusTrace AI Backend is running 🚀",
        version: "1.1.0"
    });
});

// =====================================
// HEALTH CHECK
// =====================================

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "CampusTrace AI API is healthy",
        database: "MongoDB"
    });
});

// =====================================
// 404 HANDLER
// =====================================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`
    });
});

// =====================================
// GLOBAL ERROR HANDLER
// =====================================

app.use((err, req, res, next) => {
    console.error("Server Error:", err);

    res.status(500).json({
        success: false,
        message: err.message || "Internal server error"
    });
});

// =====================================
// START SERVER
// =====================================

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log("========================================");
    console.log("🚀 CampusTrace AI Backend Started");
    console.log(`🌐 Server: http://localhost:${PORT}`);
    console.log("🔌 Realtime notifications: enabled");
    console.log("========================================");
});
