import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js";

const PORT = process.env.PORT || 3000;

// ✅ MUST be before routes
app.use(cors({
  origin: process.env.CLIENT_URI,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// connect + listen
server.listen(PORT, () => {
  console.log("Server running on port: " + PORT);
  connectDB();
});
