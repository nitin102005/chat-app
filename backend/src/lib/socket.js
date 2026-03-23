import { Server } from "socket.io";
import http from "http";
import express from "express";
import { ENV } from "./env.js";
import { socketAuthMiddleware } from "../middleware/socket.auth.middleware.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ENV.CLIENT_URL, // ✅ fixed
    credentials: true,
  },
  transports: ["websocket", "polling"], // ✅ important for deployment
});

// Apply authentication middleware
io.use(socketAuthMiddleware);

// Store online users
const userSocketMap = {}; // { userId: socketId }

// Helper function
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// Socket connection
io.on("connection", (socket) => {
  console.log("A user connected:", socket.user.fullName);

  const userId = socket.user._id; // ✅ FIXED
  userSocketMap[userId] = socket.id;

  // Send online users list
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.user.fullName);
    delete userSocketMap[userId];

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };