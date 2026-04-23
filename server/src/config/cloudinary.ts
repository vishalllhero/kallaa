import { v2 as cloudinary } from "cloudinary";

// Validate environment variables
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  throw new Error(
    "Cloudinary configuration missing. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET environment variables."
  );
}

// Validate format (basic checks)
if (
  cloudName.includes(" ") ||
  apiKey.includes(" ") ||
  apiSecret.includes(" ")
) {
  console.warn(
    "⚠️ WARNING: Cloudinary credentials contain spaces - this may cause authentication issues"
  );
}

if (!/^[a-zA-Z0-9]+$/.test(cloudName)) {
  console.warn("⚠️ WARNING: Cloudinary cloud name contains invalid characters");
}

console.log("Cloudinary Ready:", !!process.env.CLOUDINARY_API_KEY);
console.log("Cloudinary config:", {
  cloud_name: cloudName ? "✅ Set" : "❌ Missing",
  api_key: apiKey ? "✅ Set (" + apiKey.substring(0, 8) + "...)" : "❌ Missing",
  api_secret: apiSecret
    ? "✅ Set (" + apiSecret.substring(0, 8) + "...)"
    : "❌ Missing",
});

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

export default cloudinary;
