import mongoose from "mongoose";
import { User } from "./models/User.js";

const MONGO_URI = process.env.MONGO_URI!;

// Background retry loop — keeps trying every 5s without blocking startup
async function connectWithRetry() {
  while (true) {
    try {
      console.log("Connecting to MongoDB...");
      await mongoose.connect(MONGO_URI, {
        family: 4,
        serverSelectionTimeoutMS: 5000,
      });
      console.log("✅ MongoDB connected");
      return; // Success — stop retrying
    } catch (error: any) {
      console.error("❌ MongoDB Connection Failed:", error.message);
      console.log("⚠️ Retrying in 3 seconds...");
      await new Promise(res => setTimeout(res, 3000));
    }
  }
}

// Exported function: fires off background retry, resolves immediately
// so server startup is never blocked by DB
export const connectDB = () => {
  connectWithRetry().catch(err =>
    console.error("Unexpected DB retry error:", err)
  );
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
