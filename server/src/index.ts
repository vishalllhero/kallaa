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

// Admin User Seeding with retry logic
const seedAdmin = async (retries = 3) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const adminEmail = process.env.ADMIN_EMAIL || "admin@kallaa.com";
      const adminPassword = process.env.ADMIN_PASSWORD || "123456";

      console.log(
        `🔍 Admin seeding attempt ${attempt}/${retries}:`,
        adminEmail
      );

      // Check if DB is connected
      if (mongoose.connection.readyState !== 1) {
        console.log("⏳ Waiting for database connection...");
        await new Promise(resolve => setTimeout(resolve, 2000));
        continue;
      }

      const adminExists = await (User as any).findOne({ email: adminEmail });

      if (!adminExists) {
        console.log("📝 Creating admin user...");
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
        console.log(
          "   Login URL: POST /api/auth/login with email/password above"
        );
        return true;
      } else {
        console.log("ℹ️ Admin user already exists");
        return true;
      }
    } catch (error: any) {
      console.error(
        `❌ Admin seeding attempt ${attempt} failed:`,
        error.message
      );

      if (attempt === retries) {
        console.error(
          "💥 All admin seeding attempts failed - authentication may not work"
        );
        return false;
      }

      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
  return false;
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

// Connect to MongoDB with enhanced stability
const MONGO_URI =
  process.env.MONGO_URI || process.env.MONGODB_URI || process.env.DATABASE_URL;

const connectToMongoDB = async () => {
  if (!MONGO_URI) {
    console.error("❌ CRITICAL: No MongoDB URI found in environment variables");
    console.error("   Set MONGO_URI, MONGODB_URI, or DATABASE_URL");
    console.error(
      "   Example: MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/db"
    );
    return;
  }

  try {
    console.log("🔄 Connecting to MongoDB...");
    console.log("   URI:", MONGO_URI.substring(0, 30) + "...");

    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      bufferCommands: false,
    });

    console.log("✅ MongoDB connected successfully");
    console.log(
      "   Database:",
      mongoose.connection.db?.databaseName || "unknown"
    );
    console.log("   Host:", mongoose.connection.host || "unknown");

    // Set up connection event listeners
    mongoose.connection.on("error", err => {
      console.error("❌ MongoDB runtime error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ MongoDB disconnected");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("✅ MongoDB reconnected");
    });
  } catch (error: any) {
    console.error("💥 FAILED to connect to MongoDB:", error.message);
    console.error(
      "   This will cause authentication and data operations to fail"
    );

    if (error.message?.includes("authentication failed")) {
      console.error("   → Check username/password in connection string");
    } else if (error.message?.includes("getaddrinfo ENOTFOUND")) {
      console.error("   → Check cluster URL - might be incorrect or paused");
    } else if (error.message?.includes("connection timed out")) {
      console.error("   → Network connectivity issue or firewall");
    }

    // Don't exit in production - let the app continue with degraded functionality
    if (process.env.NODE_ENV !== "production") {
      console.error(
        "   Exiting in development mode due to DB connection failure"
      );
      process.exit(1);
    }
  }
};

// Initialize DB connection
connectToMongoDB();

// Seed admin user after DB connection
const initializeAdmin = async () => {
  if (!MONGO_URI) {
    console.log("⚠️ Skipping admin seeding - no MongoDB URI configured");
    return;
  }

  // Wait for DB connection
  let attempts = 0;
  while (mongoose.connection.readyState !== 1 && attempts < 10) {
    console.log("⏳ Waiting for DB connection before seeding admin...");
    await new Promise(resolve => setTimeout(resolve, 2000));
    attempts++;
  }

  if (mongoose.connection.readyState === 1) {
    await seedAdmin();
  } else {
    console.error(
      "❌ Database not connected after 20 seconds - admin seeding skipped"
    );
  }
};

initializeAdmin();

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payments", paymentRoutes);

// Health check with detailed status
app.get("/health", (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatuses: { [key: number]: string } = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };
  const dbStatus = dbStatuses[dbState] || "unknown";

  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    database: {
      status: dbStatus,
      name: mongoose.connection.db?.databaseName || null,
      host: mongoose.connection.host || null,
    },
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
    },
  });
});

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("[GLOBAL ERROR]", err.stack || err.message);
  console.error("[ERROR DETAILS]", {
    message: err.message,
    stack: err.stack,
    code: err.code,
    errno: err.errno,
    syscall: err.syscall,
  });

  // Handle CORS errors specifically
  if (err.message === "CORS policy violation") {
    console.error("[CORS ERROR] Origin blocked:", req.headers.origin);
    return res.status(403).json({
      success: false,
      message: "CORS policy violation",
      origin: req.headers.origin,
    });
  }

  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Prevent crashes - enhanced error handling
process.on("uncaughtException", err => {
  console.error("💥 CRITICAL: Uncaught Exception:", err);
  console.error("Stack:", err.stack);
  // Don't exit in production, just log
  if (process.env.NODE_ENV !== "production") {
    process.exit(1);
  }
});

process.on("unhandledRejection", (reason, promise) => {
  console.error(
    "💥 CRITICAL: Unhandled Rejection at:",
    promise,
    "reason:",
    reason
  );
  // Don't exit in production, just log
  if (process.env.NODE_ENV !== "production") {
    process.exit(1);
  }
});

process.on("SIGTERM", () => {
  console.log("📴 SIGTERM received, shutting down gracefully...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("📴 SIGINT received, shutting down gracefully...");
  process.exit(0);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
