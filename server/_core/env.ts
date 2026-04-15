import "dotenv/config";

// Validate required environment variables
const requiredEnvVars = [
  'MONGO_URI',
  'JWT_SECRET',
  'RAZORPAY_KEY_ID',
  'RAZORPAY_KEY_SECRET',
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingVars);
  console.error('Please check your .env file and ensure all required variables are set.');
  process.exit(1);
}

export const ENV = {
  // Application
  isProduction: process.env.NODE_ENV === "production",
  port: parseInt(process.env.PORT || "5000"),

  // Database
  mongoUri: process.env.MONGO_URI!,

  // Authentication
  jwtSecret: process.env.JWT_SECRET!,

  // Razorpay (Payment Gateway)
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID!,
    keySecret: process.env.RAZORPAY_KEY_SECRET!,
  },

  // Cloudinary (Media Storage) - Optional
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
};

// Log environment status (without exposing secrets)
console.log(`✅ Environment loaded: ${ENV.isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}`);
console.log(`📊 Port: ${ENV.port}`);
console.log(`🗄️  Database: ${ENV.mongoUri ? 'Configured' : 'Missing'}`);
console.log(`🔐 JWT: ${ENV.jwtSecret ? 'Configured' : 'Missing'}`);
console.log(`💳 Razorpay: ${ENV.razorpay.keyId ? 'Configured' : 'Missing'}`);
console.log(`☁️  Cloudinary: ${ENV.cloudinary.cloudName ? 'Configured' : 'Missing'}`);

if (!ENV.isProduction) {
  console.log('\n⚠️  DEVELOPMENT MODE - Using localhost URLs');
} else {
  console.log('\n🚀 PRODUCTION MODE - Using production configuration');
}
