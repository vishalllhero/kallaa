import "dotenv/config";

export const ENV = {
  appId: process.env.VITE_APP_ID ?? "kallaa-app-id",
  cookieSecret: process.env.JWT_SECRET ?? "default_secret",
  databaseUrl: process.env.DATABASE_URL ?? "",
  mongoUri: process.env.MONGO_URI ?? "mongodb+srv://kallaa:Vishalhero003@cluster0.wsjcmdt.mongodb.net/kallaa?retryWrites=true&w=majority",

  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
  port: parseInt(process.env.PORT || "5000"),
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID,
    keySecret: process.env.RAZORPAY_KEY_SECRET,
  },
};
