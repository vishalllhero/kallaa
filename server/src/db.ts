import mongoose from "mongoose";
import { User } from "./models/User.js";

// Validate and get MongoDB URI with fallback and better error messages
function getMongoURI(): string {
  const MONGO_URI =
    process.env.MONGO_URI ||
    process.env.MONGODB_URI ||
    process.env.DATABASE_URL;

  if (!MONGO_URI) {
    const isProduction = process.env.NODE_ENV === "production";

    if (isProduction) {
      console.error(
        "❌ CRITICAL: No MongoDB URI found in environment variables (PRODUCTION)"
      );
      console.error(
        "   Please set one of these environment variables in Railway:"
      );
      console.error("   - MONGO_URI (recommended)");
      console.error("   - MONGODB_URI");
      console.error("   - DATABASE_URL");
      console.error("");
      console.error(
        "   Example: MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database"
      );
      throw new Error(
        "MongoDB URI not configured. Server cannot start without database connection in production."
      );
    } else {
      console.warn(
        "⚠️ WARNING: No MongoDB URI found in environment variables (DEVELOPMENT)"
      );
      console.warn(
        "   The server will start but database operations will fail."
      );
      console.warn(
        "   Please set MONGO_URI in your .env file for full functionality."
      );
      console.warn(
        "   Example: MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database"
      );
      console.warn("");
      // Return a dummy URI for development - connection will be skipped
      return "mongodb://dummy:27017/dummy";
    }
  }

  // Basic validation - should start with mongodb:// or mongodb+srv://
  if (
    !MONGO_URI.startsWith("mongodb://") &&
    !MONGO_URI.startsWith("mongodb+srv://")
  ) {
    console.error(
      "❌ INVALID: MongoDB URI should start with 'mongodb://' or 'mongodb+srv://'"
    );
    console.error("   Current value:", MONGO_URI.substring(0, 20) + "...");
    throw new Error("Invalid MongoDB URI format");
  }

  console.log("✅ MongoDB URI validated successfully");
  return MONGO_URI;
}

const MONGO_URI = getMongoURI();
const IS_DB_CONFIGURED = MONGO_URI !== "mongodb://dummy:27017/dummy";

// Background retry loop — keeps trying every 5s without blocking startup
async function connectWithRetry() {
  if (!IS_DB_CONFIGURED) {
    console.log(
      "⚠️ Skipping MongoDB connection (no URI configured for development)"
    );
    return;
  }

  let retryCount = 0;
  const maxRetries = process.env.NODE_ENV === "production" ? 20 : 5; // More retries in production

  while (retryCount < maxRetries) {
    try {
      console.log(
        `🔄 Connecting to MongoDB (attempt ${retryCount + 1}/${maxRetries})...`
      );
      console.log(`   URI: ${MONGO_URI.substring(0, 30)}...`);

      await mongoose.connect(MONGO_URI, {
        family: 4,
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
        bufferCommands: false,
      });

      console.log("✅ MongoDB connected successfully!");
      console.log(
        `   Database: ${mongoose.connection.db?.databaseName || "unknown"}`
      );
      console.log(`   Host: ${mongoose.connection.host || "unknown"}`);

      // Setup connection event listeners
      mongoose.connection.on("error", err => {
        console.error("❌ MongoDB runtime error:", err);
      });

      mongoose.connection.on("disconnected", () => {
        console.warn("⚠️ MongoDB disconnected");
      });

      mongoose.connection.on("reconnected", () => {
        console.log("✅ MongoDB reconnected");
      });

      return; // Success — stop retrying
    } catch (error: any) {
      retryCount++;
      console.error(
        `❌ MongoDB Connection Failed (attempt ${retryCount}/${maxRetries}):`,
        error.message
      );

      if (error.message?.includes("authentication failed")) {
        console.error(
          "   → Check your username/password in the connection string"
        );
      } else if (error.message?.includes("getaddrinfo ENOTFOUND")) {
        console.error(
          "   → Check your cluster URL - it might be incorrect or the cluster might be paused"
        );
      } else if (error.message?.includes("connection timed out")) {
        console.error(
          "   → Network connectivity issue or firewall blocking connection"
        );
      }

      if (retryCount < maxRetries) {
        const retryDelay = Math.min(3000 * retryCount, 30000); // Exponential backoff, max 30s
        console.log(`⚠️ Retrying in ${retryDelay / 1000} seconds...`);
        await new Promise(res => setTimeout(res, retryDelay));
      } else {
        console.error(
          "❌ Max retries reached. Giving up on MongoDB connection."
        );
        console.error(
          "   The server will continue running but database operations will fail."
        );
        console.error(
          "   Please check your Railway environment variables and MongoDB Atlas settings."
        );
        return; // Stop retrying after max attempts
      }
    }
  }
}

// Exported function: fires off background retry, resolves immediately
// so server startup is never blocked by DB
export const connectDB = () => {
  console.log("🚀 Starting MongoDB connection process...");
  connectWithRetry().catch(err => {
    console.error("💥 Unexpected DB connection error:", err);
    console.error("   This is a critical error that should not happen.");
  });
};

export async function upsertUser(userData: any): Promise<any> {
  try {
    const { email, ...rest } = userData;
    const user = await (User as any).findOneAndUpdate(
      { email },
      { ...rest, email },
      { upsert: true, new: true }
    );
    return user;
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(id: string) {
  try {
    if (mongoose.Types.ObjectId.isValid(id)) {
      return await (User as any).findById(id);
    }
    return await (User as any).findOne({ email: id });
  } catch {
    return null;
  }
}

export async function getUserByEmail(email: string) {
  return await (User as any).findOne({ email });
}
