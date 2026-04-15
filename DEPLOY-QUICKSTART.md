# 🚀 Quick Deployment Reference

## Backend (Render)

**URL:** https://render.com
**Service Type:** Web Service
**Runtime:** Node
**Build Command:** `npm install`
**Start Command:** `npm start`

### Environment Variables:
```
NODE_ENV=production
PORT=10000
MONGO_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/kallaa
JWT_SECRET=your_32_char_secure_secret_here
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET=your_secret_key
```

## Frontend (Vercel)

**URL:** https://vercel.com
**Framework:** Vite
**Root Directory:** `client`
**Build Command:** `npm run build`
**Output Directory:** `dist`

### Environment Variables:
```
VITE_API_URL=https://your-render-backend.onrender.com
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
```

## Post-Deployment Updates

### 1. Update CORS
After getting your Vercel URL, update `server/_core/index.ts`:

```typescript
const corsOrigins = ENV.isProduction
  ? ['https://your-vercel-app.vercel.app']
  : ['http://localhost:5173'];
```

### 2. Update Frontend Environment
In Vercel dashboard, set:
```
VITE_API_URL=https://your-render-service.onrender.com
```

## Testing Commands

```bash
# Test backend API
curl https://your-render-backend.onrender.com/api/products

# Test frontend
open https://your-vercel-app.vercel.app
```

## Production URLs (After Deployment)

- **Frontend:** `https://kallaa.vercel.app`
- **Backend:** `https://kallaa-backend.onrender.com`
- **Database:** MongoDB Atlas

---

**🎯 Ready to deploy! Follow DEPLOYMENT-GUIDE.md for detailed steps.**