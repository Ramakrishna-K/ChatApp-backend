

import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";


import { connectDB } from "./lib/db.js";

const app = express();
const PORT = process.env.PORT || 5000;

// needed for ES modules
const __dirname = path.resolve();

/* =======================
   MIDDLEWARES
======================= */

// app.use(
//   cors({
//     // origin: "http://localhost:5173",
//          origin: "https://chat-app-nexa-frontend.vercel.app",

//     credentials: true, // allow cookies
//   })
// );
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://chat-app-nexa-frontend.vercel.app",
    ],
    credentials: true,
  })
);
// increase payload limit (important for profile image upload)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(cookieParser());

// ✅ serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* =======================
   ROUTES
======================= */

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

/* =======================
   PRODUCTION BUILD
======================= */

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(
      path.join(__dirname, "../frontend/dist/index.html")
    );
  });
}

/* =======================
   START SERVER
======================= */

app.listen(PORT, async () => {
  console.log(`✅ Server running on port ${PORT}`);
  await connectDB();
});


