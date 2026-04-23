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

console.log("Cloudinary config:", {
  cloud_name: cloudName ? "✅ Set" : "❌ Missing",
  api_key: apiKey ? "✅ Set" : "❌ Missing",
  api_secret: apiSecret ? "✅ Set" : "❌ Missing",
});

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

export default cloudinary;
