import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { User } from "./models/User.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

const app = express();

// Middleware
const allowedOrigins = [
  "https://kallaa-w9et.vercel.app",
  "https://kallaa-w9et-ars81vpn7-kallaa.vercel.app",
  "http://localhost:5173", // For development
  "http://localhost:3000", // Alternative dev port
];

app.use(
  cors({
    origin: function (origin, callback) {
      console.log("CORS check - Origin:", origin);

      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) {
        console.log("CORS: Allowing request with no origin");
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        console.log("CORS: Allowing origin:", origin);
        return callback(null, true);
      }

      console.log("CORS blocked origin:", origin);
      return callback(new Error("CORS policy violation"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);

app.use(express.json());
app.use(cookieParser());

// Admin User Seeding
const seedAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@kallaa.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "123456";

    console.log("🔍 Checking for admin user:", adminEmail);

    const adminExists = await (User as any).findOne({ email: adminEmail });

    if (!adminExists) {
      const admin = new User({
        name: "Admin User",
        email: adminEmail,
        password: adminPassword, // Will be hashed by the pre-save hook
        role: "admin",
      });
      await admin.save();
      console.log("✅ Admin user created successfully");
      console.log("   Email:", adminEmail);
      console.log("   Password:", adminPassword);
    } else {
      console.log("ℹ️ Admin user already exists");
    }
  } catch (error) {
    console.error("❌ Failed to seed admin user:", error);
  }
};

// Debug logging
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(
    `[${new Date().toISOString()}] ${req.method} ${req.url} - Origin: ${req.headers.origin || "none"}`
  );
  next();
});

// Environment validation and logging
console.log("🔍 Environment Check:");
console.log(`   NODE_ENV: ${process.env.NODE_ENV || "not set"}`);
console.log(`   PORT: ${process.env.PORT || "5000 (default)"}`);
console.log(`   MONGO_URI: ${process.env.MONGO_URI ? "✅ Set" : "❌ Not set"}`);
console.log(
  `   ADMIN_EMAIL: ${process.env.ADMIN_EMAIL || "admin@kallaa.com (default)"}`
);
console.log(
  `   RAZORPAY_KEY_ID: ${process.env.RAZORPAY_KEY_ID ? "✅ Set" : "⚠️ Not set (payments disabled)"}`
);
console.log(
  `   RAZORPAY_KEY_SECRET: ${process.env.RAZORPAY_KEY_SECRET ? "✅ Set" : "⚠️ Not set (payments disabled)"}`
);
console.log("");

// Connect to MongoDB
const MONGO_URI =
  process.env.MONGO_URI || process.env.MONGODB_URI || process.env.DATABASE_URL;

if (MONGO_URI) {
  mongoose
    .connect(MONGO_URI)
    .then(() => console.log("✅ MongoDB connected"))
    .catch(err => console.error("❌ MongoDB connection error:", err));
} else {
  console.warn("⚠️ No MongoDB URI found - database operations will fail");
}

// Seed admin user (only if DB is configured and connected)
if (
  process.env.MONGO_URI ||
  process.env.MONGODB_URI ||
  process.env.DATABASE_URL
) {
  // Check if DB connection is established before seeding
  const checkAndSeed = async () => {
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      try {
        // Wait for mongoose to be ready
        if (mongoose.connection.readyState === 1) {
          // Connected
          console.log("🔄 Starting admin user seeding...");
          await seedAdmin();
          return;
        }
      } catch (error) {
        console.error("❌ Admin seeding failed:", error);
      }

      attempts++;
      if (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
      }
    }

    console.log(
      "⚠️ Admin seeding skipped (database not connected after multiple attempts)"
    );
  };

  setTimeout(checkAndSeed, 3000); // Initial delay
} else {
  console.log("⚠️ Skipping admin seeding (no database configured)");
}

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payments", paymentRoutes);

// Health check
app.get("/health", (req, res) => res.json({ status: "ok" }));

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("[ERROR]", err.stack);
  res.status(500).json({ error: "Internal server error" });
});

// Prevent crashes
process.on("uncaughtException", err => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
