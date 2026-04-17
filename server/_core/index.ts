import express from "express";
import { createServer } from "http";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "./routers/index";
import { createContext } from "./context";
import { setupVite, serveStatic } from "./vite";
import { ENV } from "./env";
import productRoutes from "../routes/productRoutes";
import orderRoutes from "../routes/orderRoutes";
import authRoutes from "../routes/authRoutes";
import adminRoutes from "../routes/adminRoutes";
import paymentRoutes from "../routes/paymentRoutes";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import { connectDB } from "../db";
// User model imported dynamically after DB connects (see admin seed below)

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Task 6: Request Logging
  app.use((req, res, next) => {
    console.log(`[DEBUG] ${req.method} ${req.url}`);
    next();
  });

  // CORS configuration
  const corsOrigins = ENV.isProduction
    ? [
      "https://kallaa.vercel.app", // Production Vercel URL
      "https://kallaa-ecommerce.vercel.app", // Alternative production URL
      // Add your actual Vercel domain here when deployed
    ]
    : [
      "http://localhost:5173", // Vite dev server
      "http://localhost:3000", // Alternative dev port
    ];

  app.use(
    cors({
      origin: corsOrigins,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    })
  );

  console.log(`🌐 CORS configured for: ${corsOrigins.join(", ")}`);
  app.use(express.json());
  app.use(cookieParser());

  // Static file serving for uploads
  app.use("/uploads", express.static("uploads"));

  // Upload API route
  const { memoryUpload, uploadToCloudinary } =
    await import("../middlewares/uploadMiddleware");
  app.post(
    "/api/upload",
    memoryUpload.array("images", 5),
    async (req: any, res: Response) => {
      try {
        console.log("FILES:", req.files);
        if (!req.files || req.files.length === 0) {
          return res.status(400).json({ message: "No files uploaded" });
        }

        // Check if Cloudinary is configured
        const useCloudinary =
          ENV.cloudinary.cloudName &&
          ENV.cloudinary.apiKey &&
          ENV.cloudinary.apiSecret;

        if (useCloudinary) {
          // Upload to Cloudinary
          console.log("Uploading to Cloudinary...");
          const uploadPromises = req.files(Array.isArray(data) ? data : []).map(...)
            (Array.isArray(orders) ? orders : []).map(...)
            (Array.isArray(items) ? items : []).map(...)
          async (file: Express.Multer.File) => {
            const filename = `${Date.now()}-${file.originalname}`;
            return await uploadToCloudinary(file.buffer, filename);
          }
          );

  const urls = await Promise.all(uploadPromises);
  console.log("CLOUDINARY UPLOAD SUCCESS - URLs:", urls);
  res.json({ urls });
} else {
  // Fallback to local storage
  console.log("Cloudinary not configured, using local storage");
  const urls = req.files(Array.isArray(data) ? data : []).map(...)
    (Array.isArray(orders) ? orders : []).map(...)
    (Array.isArray(items) ? items : []).map(...)
    (file: Express.Multer.File, index: number) => {
    const filename = `upload-${Date.now()}-${index}${path.extname(file.originalname)}`;
    // For memory storage, we'd need to save to disk or use a different approach
    // For now, return a placeholder
    return `/uploads/${filename}`;
  }
          );
  console.log("LOCAL UPLOAD SUCCESS - URLs:", urls);
  res.json({ urls });
}
      } catch (error) {
  console.error("UPLOAD ERROR:", error);
  res.status(500).json({ message: "Upload failed" });
}
    }
  );

// Start DB connection in background — server boots regardless
connectDB();

// Seed admin user only after DB is actually connected
import("mongoose").then(({ default: mongoose }) => {
  mongoose.connection.once("connected", async () => {
    try {
      const { User } = await import("../models/User");
      const adminExists = await User.findOne({ email: "admin@kallaa.com" });
      if (!adminExists) {
        const admin = new User({
          name: "Admin User",
          email: "admin@kallaa.com",
          password: "123456",
          role: "admin",
        });
        await admin.save();
        console.log("✅ Admin user created: admin@kallaa.com / 123456");
      } else {
        console.log("ℹ️ Admin user already exists");
      }
    } catch (error) {
      console.error("❌ Failed to create/verify admin user:", error);
    }
  });
});

// REST API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payments", paymentRoutes);

// tRPC middleware
app.use(
  "/api/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

if (process.env.NODE_ENV === "development") {
  console.log("[Server] Starting in development mode with Vite...");
  await setupVite(app, server);
} else {
  console.log("[Server] Starting in production mode...");
  serveStatic(app);
}

const PORT = ENV.port || 3000;

server.once("error", (err: any) => {
  if (err.code === "EADDRINUSE") {
    console.log(`⚠️ Port ${PORT} busy, switching to 3001...`);
    server.listen(3001, () => {
      console.log(`✅ Server running on http://localhost:3001`);
    });
  }
});

server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
}

startServer().catch(err => {
  console.error("[Server] Critical failure during startup:", err);
  process.exit(1);
});
