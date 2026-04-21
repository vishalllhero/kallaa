# Vercel Deployment Configuration

## Project Structure

```
kallaa/
├── client/          # Frontend (React + Vite)
│   ├── src/
│   ├── package.json
│   ├── vercel.json  # ✅ SPA routing config
│   └── vite.config.ts
├── server/          # Backend (Node.js + Express)
└── README.md
```

## Vercel Dashboard Settings

### 1. Project Settings

- **Framework Preset**: `Vite`
- **Root Directory**: `client` ← **IMPORTANT**
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 2. Environment Variables

```
VITE_API_URL=https://kallaa-backend-production.up.railway.app
```

## Deployment Steps

1. **Connect Repository** to Vercel
2. **Set Root Directory** to `client` in Vercel dashboard
3. **Deploy** - Vercel will build from `/client` folder
4. **Test Routes** - All SPA routes should work

## Troubleshooting

### If /admin still shows 404:

1. Check Vercel dashboard → Project Settings → Build & Output
2. Ensure **Root Directory** is set to `client`
3. Ensure **Framework Preset** is `Vite`
4. **Redeploy manually** (clear build cache)

### SPA Routing Verification:

- ✅ `vercel.json` has rewrite rules
- ✅ All routes (`/admin`, `/products`, etc.) serve `index.html`
- ✅ React Router handles client-side routing

## Expected Results

After correct configuration:

- `https://yourdomain.vercel.app/` → Homepage ✅
- `https://yourdomain.vercel.app/admin` → Admin Dashboard ✅
- `https://yourdomain.vercel.app/products` → Products Gallery ✅
- No 404 errors for any client-side routes ✅
