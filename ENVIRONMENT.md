# 🔧 Environment Configuration Guide

## Overview

KALLAA uses a secure, production-ready environment configuration that separates development and production settings, ensuring sensitive data is never exposed to the frontend.

## 📁 File Structure

```
kallaa-ecommerce/
├── .env                    # Backend environment (server-side only)
├── .env.production.example # Production environment template
├── client/
│   └── .env               # Frontend environment (browser-safe)
└── server/
    └── _core/
        └── env.ts         # Environment validation & configuration
```

## 🔐 Backend Environment (.env)

**Location:** Root directory (server-side only)
**Security:** Never committed to version control

```bash
# Application
NODE_ENV=development
PORT=5000

# Database
MONGO_URI=mongodb+srv://...

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here

# Payments
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET=your_secret_key_here

# Media Storage
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_secret_key
```

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` / `production` |
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | JWT signing secret | `32+ character random string` |
| `RAZORPAY_KEY_ID` | Razorpay public key | `rzp_test_xxxxxxxxxx` |
| `RAZORPAY_KEY_SECRET` | Razorpay secret key | `secret_key_here` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `CLOUDINARY_*` | Cloudinary credentials | `null` |

## 🌐 Frontend Environment (client/.env)

**Location:** `client/.env`
**Security:** Only `VITE_` prefixed variables are exposed to browser

```bash
# API Configuration
VITE_API_URL=http://localhost:5000

# Public Keys (Safe to expose)
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
```

### Frontend Variables

| Variable | Description | Example | Exposed to Browser |
|----------|-------------|---------|-------------------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000` | ✅ |
| `VITE_RAZORPAY_KEY_ID` | Razorpay public key | `rzp_test_xxxxxxxxxx` | ✅ |

## 🚀 Production Setup

### 1. Environment Variables

```bash
# Copy production template
cp .env.production.example .env

# Edit with real values
nano .env
```

### 2. Deployment Platforms

#### Vercel (Frontend)
```bash
# Environment Variables in Vercel Dashboard:
VITE_API_URL=https://your-backend.onrender.com
VITE_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxx
```

#### Render (Backend)
```bash
# Environment Variables in Render Dashboard:
NODE_ENV=production
PORT=10000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_production_secret
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxx
RAZORPAY_KEY_SECRET=your_live_secret
```

### 3. CORS Configuration

Backend automatically configures CORS based on `NODE_ENV`:

- **Development:** `http://localhost:5173`
- **Production:** `https://your-app.vercel.app`

Update `server/_core/index.ts` with your production domain.

## 🔒 Security Best Practices

### ✅ What We Do Right

1. **Server-side secrets only:** Sensitive keys never reach the browser
2. **Environment validation:** App fails fast if required vars are missing
3. **CORS protection:** Only allowed origins can access API
4. **HTTPS enforcement:** Production uses secure connections
5. **Separate environments:** Dev and prod use different credentials

### ❌ What to Avoid

1. **Never commit .env files**
2. **Never use VITE_ prefix for secrets**
3. **Never hardcode credentials in code**
4. **Never share secrets between environments**

## 🧪 Testing Environment Setup

### Local Development
```bash
# Backend will validate environment on startup
npm run dev

# Should see:
✅ Environment loaded: DEVELOPMENT
📊 Port: 5000
🗄️  Database: Configured
🔐 JWT: Configured
💳 Razorpay: Configured
```

### Production Deployment
```bash
# Check logs for environment validation
# All services should start without errors
```

## 🔧 Troubleshooting

### "Missing required environment variables"
- Check `.env` file exists and has all required variables
- Ensure variable names match exactly (case-sensitive)
- Restart the application after adding variables

### "CORS error"
- Verify frontend domain is in CORS allowlist
- Check if using HTTPS in production
- Ensure VITE_API_URL matches backend domain

### "Razorpay not working"
- Verify VITE_RAZORPAY_KEY_ID is set correctly
- Check RAZORPAY_KEY_SECRET is server-side only
- Ensure using test/live keys appropriately

## 📋 Environment Checklist

### Pre-Deployment
- [ ] `.env` file created with all required variables
- [ ] Secrets are strong and unique
- [ ] No `.env` files in version control
- [ ] CORS domains configured for production

### Post-Deployment
- [ ] Backend starts without environment errors
- [ ] Frontend can communicate with backend
- [ ] Payments work with correct keys
- [ ] Images upload/download correctly

---

**Remember:** Environment configuration is critical for security and functionality. Take the time to set it up correctly!