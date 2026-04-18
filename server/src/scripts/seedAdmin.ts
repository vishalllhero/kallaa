import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../models/User";
import { connectDB } from "../db";

dotenv.config();

async function seedAdmin() {
  try {
    await connectDB();
    
    // Wait for connection
    await new Promise((resolve) => {
      if (mongoose.connection.readyState === 1) resolve(true);
      else mongoose.connection.once("connected", () => resolve(true));
    });

    const adminEmail = process.env.ADMIN_EMAIL || "admin@kallaa.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "123456";

    const adminExists = await (User as any).findOne({ email: adminEmail });
    
    if (!adminExists) {
      const admin = new User({
        name: "Admin User",
        email: adminEmail,
        password: adminPassword,
        role: "admin",
      });
      await admin.save();
      console.log("✅ Admin user created successfully");
    } else {
      console.log("ℹ️ Admin user already exists");
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to seed admin user:", error);
    process.exit(1);
  }
}

seedAdmin();
