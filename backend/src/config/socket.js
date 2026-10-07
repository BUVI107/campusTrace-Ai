const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

// =====================================================
// SOCKET.IO SETUP
// Every connected client joins a private room named after
// their user id, so a notification can be sent straight to
// "the right person" with io.to(`user:<id>`).emit(...)
// instead of broadcasting to everyone.
// =====================================================

let io = null;

const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL || "http://localhost:5173",
            credentials: true
        }
    });

    io.use((socket, next) => {
        try {
            const token =
                socket.handshake.auth?.token ||
                socket.handshake.query?.token;

            if (!token) {
                return next(
                    new Error("Authentication token required")
                );
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            socket.userId = decoded.userId;

            next();
        } catch (error) {
            next(new Error("Invalid or expired socket token"));
        }
    });

    io.on("connection", (socket) => {
        socket.join(`user:${socket.userId}`);

        socket.on("disconnect", () => {
            // no-op — room membership is cleaned up automatically
        });
    });

    console.log("🔌 Socket.IO initialized");

    return io;
};

const getIO = () => io;

module.exports = { initSocket, getIO };
