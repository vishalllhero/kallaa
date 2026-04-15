# 🚀 KALLAA Production Deployment Guide

## Overview

Deploy the complete MERN + Vite e-commerce platform to production using Render (backend) and Vercel (frontend).

## Prerequisites

- ✅ GitHub repository with code pushed
- ✅ MongoDB Atlas account and cluster
- ✅ Razorpay account (optional for now)
- ✅ Render account
- ✅ Vercel account

## Phase 1: Environment Setup

### 1. MongoDB Atlas

1. Create cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create database user with password
3. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/database`
4. Add IP: `0.0.0.0/0` for Render access

### 2. Razorpay (Optional)

1. Sign up at [razorpay.com](https://razorpay.com)
2. Get API Keys from Dashboard
3. Note: `rzp_test_*` for testing, `rzp_live_*` for production

### 3. Generate Secure Secrets

```bash
# Generate JWT secret (32+ characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Example output: a1b2c3d4e5f678901234567890123456789012345678901234567890
```

## Phase 2: Backend Deployment (Render)

### Step 1: Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up/Sign in with GitHub

### Step 2: Deploy Backend

1. **Click "New" → "Web Service"**
2. **Connect GitHub repository**
3. **Configure service:**
   - **Name:** `kallaa-backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free tier (upgrade later if needed)

### Step 3: Environment Variables

Add these in Render dashboard under "Environment":

```
# Required Variables
NODE_ENV=production
PORT=10000
MONGO_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/kallaa?retryWrites=true&w=majority
JWT_SECRET=your_super_secure_jwt_secret_32_chars_minimum

# Razorpay (add when ready for payments)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret_key

# Cloudinary (optional)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_secret_key
```

### Step 4: Deploy

1. **Click "Create Web Service"**
2. **Wait for deployment** (5-10 minutes)
3. **Get your backend URL** (e.g., `https://kallaa-backend.onrender.com`)

## Phase 3: Frontend Deployment (Vercel)

### Step 1: Connect Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. **Click "Import Project"**
4. **Select your GitHub repository**

### Step 2: Configure Project

1. **Framework Preset:** `Vite`
2. **Root Directory:** `client`
3. **Build Command:** `npm run build`
4. **Output Directory:** `dist`

### Step 3: Environment Variables

Add in Vercel dashboard:

```
VITE_API_URL=https://your-render-backend-url.onrender.com
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
```

### Step 4: Deploy

1. **Click "Deploy"**
2. **Wait for deployment** (2-3 minutes)
3. **Get your frontend URL** (e.g., `https://kallaa.vercel.app`)

## Phase 4: Update CORS

### Backend CORS Update

1. **Go to Render dashboard**
2. **Edit your backend service**
3. **Update CORS in `server/_core/index.ts`:**

```typescript
const corsOrigins = ENV.isProduction
  ? [
      'https://your-vercel-app.vercel.app', // Replace with your Vercel URL
      'https://kallaa.vercel.app',
    ]
  : [
      'http://localhost:5173',
      'http://localhost:3000',
    ];
```

4. **Commit and push changes**
5. **Render will auto-redeploy**

## Phase 5: Testing & Validation

### 1. Frontend Tests

Visit your Vercel URL and check:
- ✅ **Homepage loads**
- ✅ **Navigation works**
- ✅ **Products display**
- ✅ **No console errors**

### 2. API Tests

Test these endpoints (replace with your Render URL):

```bash
# Products API
curl https://your-render-backend.onrender.com/api/products

# Should return product list
```

### 3. CORS Test

```bash
# Test from browser console
fetch('https://your-render-backend.onrender.com/api/products')
  .then(r => r.json())
  .then(console.log)
```

### 4. Image Loading Test

- ✅ Upload images work
- ✅ Product images display
- ✅ No 404 errors

## Phase 6: Domain Setup (Optional)

### Custom Domain

1. **Vercel:** Add domain in project settings
2. **Update CORS:** Add your custom domain to backend CORS
3. **SSL:** Automatic on both platforms

## Troubleshooting

### Backend Issues

**"Missing environment variables"**
- Check all required vars are set in Render dashboard
- Ensure no typos in variable names

**"Database connection failed"**
- Verify MongoDB Atlas connection string
- Check IP whitelist allows `0.0.0.0/0`

### Frontend Issues

**"API calls failing"**
- Verify `VITE_API_URL` is correct
- Check CORS allows your Vercel domain

**"Images not loading"**
- Ensure backend serves `/uploads` correctly
- Check Cloudinary credentials if using cloud storage

## Production URLs

After deployment:
- **Frontend:** `https://your-project.vercel.app`
- **Backend:** `https://your-project.onrender.com`
- **Database:** MongoDB Atlas

## Security Checklist

- ✅ Environment variables not in code
- ✅ Secrets server-side only
- ✅ CORS configured correctly
- ✅ HTTPS enabled
- ✅ No localhost references

## Performance Optimization

- ✅ Vercel auto-optimizes assets
- ✅ Render provides CDN
- ✅ Images compressed
- ✅ Code minified

## Monitoring

- ✅ Vercel analytics
- ✅ Render logs
- ✅ Error tracking (add Sentry later)

## Next Steps

1. ✅ **Core deployment complete**
2. 🔄 **Add Razorpay integration**
3. 🔄 **Set up monitoring**
4. 🔄 **Configure custom domain**
5. 🔄 **Add analytics**

---

**🎉 Congratulations!** Your KALLAA e-commerce platform is now live in production!

**Need help?** Check the logs in Render/Vercel dashboards for any issues.