#!/usr/bin/env node

/**
 * Railway Deployment Health Check
 * Run this script to verify your Railway deployment is configured correctly
 */

console.log("🔍 KALLAA Backend - Railway Deployment Health Check");
console.log("==================================================\n");

// Environment Variables Check
console.log("📋 Environment Variables:");
const requiredVars = ["MONGO_URI"];
const optionalVars = [
  "NODE_ENV",
  "PORT",
  "ADMIN_EMAIL",
  "ADMIN_PASSWORD",
  "RAZORPAY_KEY_ID",
  "RAZORPAY_KEY_SECRET",
];

requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: Set (${value.substring(0, 20)}...)`);
  } else {
    console.log(`❌ ${varName}: NOT SET (REQUIRED)`);
  }
});

console.log("");

optionalVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: Set`);
  } else {
    console.log(`⚠️  ${varName}: Not set (optional)`);
  }
});

console.log("\n🔗 Database Connection:");
const mongoUri =
  process.env.MONGO_URI || process.env.MONGODB_URI || process.env.DATABASE_URL;
if (mongoUri) {
  if (
    mongoUri.startsWith("mongodb://") ||
    mongoUri.startsWith("mongodb+srv://")
  ) {
    console.log("✅ MongoDB URI format: Valid");
  } else {
    console.log(
      "❌ MongoDB URI format: Invalid (should start with mongodb:// or mongodb+srv://)"
    );
  }
} else {
  console.log("❌ MongoDB URI: Not configured");
}

console.log("\n💳 Payment Configuration:");
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  console.log("✅ Razorpay: Configured (payments enabled)");
} else {
  console.log(
    "⚠️  Razorpay: Not configured (payments disabled - safe fallback enabled)"
  );
}

console.log("\n🚀 Deployment Recommendations:");
if (!mongoUri) {
  console.log("❌ CRITICAL: Set MONGO_URI in Railway Variables");
  console.log(
    "   Example: mongodb+srv://username:password@cluster.mongodb.net/database"
  );
}

if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
  console.log(
    "⚠️  Consider setting ADMIN_EMAIL and ADMIN_PASSWORD for admin access"
  );
}

console.log("\n✨ Next Steps:");
console.log("1. Set required environment variables in Railway");
console.log("2. Deploy your application");
console.log("3. Check Railway logs for successful MongoDB connection");
console.log("4. Test API endpoints at /health and /api/auth/me");

console.log(
  "\n📚 Documentation: See README.md for detailed setup instructions"
);
