# 🚨 CRITICAL: Vercel Root Directory Fix

## The Problem

ALL routes (`/admin`, `/login`, `/products`, etc.) return 404 on Vercel because Vercel uses **repository root** instead of `/client` as project root.

## The Solution

### IMMEDIATE FIX: Update Vercel Settings

1. Go to **Vercel Dashboard** → **Your Project** → **Settings** → **General**
2. Change **Root Directory** from `(empty)` to `client`
3. **Save** changes
4. **Redeploy** with "Clear build cache" enabled

### If That Doesn't Work: Nuclear Reset

1. **DELETE** the Vercel project completely
2. **Wait 5 minutes** for cleanup
3. **Re-import** from GitHub
4. **During import**: Set **Root Directory = `client`**
5. **Deploy**

### Verify Configuration

```
Root Directory: client ✅ (CRITICAL)
Framework: Vite ✅ (auto-detected)
Build Command: npm run build ✅
Output Directory: dist ✅
```

### Step 3: Redeploy with Cache Clear

- Deploy → Redeploy
- Enable: **Clear build cache**

---

# Vercel Deployment Configuration

## Project Structure

```
kallaa/
├── client/          # ← THIS IS THE FRONTEND ROOT
│   ├── src/
│   ├── package.json
│   ├── vercel.json  # ✅ SPA routing config
│   └── vite.config.ts
├── server/          # Backend (Railway)
└── README.md
```

## 🚨 CRITICAL VERCEL SETTINGS

### Vercel Dashboard → Project Settings → General

| Setting            | Value           | Status                  |
| ------------------ | --------------- | ----------------------- |
| **Root Directory** | `client`        | **CRITICAL - MUST SET** |
| Framework Preset   | `Vite`          | ✅ Auto-detected        |
| Build Command      | `npm run build` | ✅                      |
| Output Directory   | `dist`          | ✅                      |

### If Root Directory is Wrong:

1. **DELETE** the Vercel project
2. **RE-IMPORT** from GitHub
3. **SET** Root Directory = `client` during import

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

## 🚨 Emergency Troubleshooting

### If Routes Still Return 404:

**Check Vercel Build Logs:**

1. Go to Vercel Dashboard → Project → Deployments
2. Click latest deployment → View Logs
3. **Look for:** `Building inside /client` ✅
4. **If you see:** `Building inside /` ❌ → Root directory wrong!

**If Root Directory is Wrong:**

```
❌ Current: Root Directory = (empty or wrong)
✅ Fix: Root Directory = client
```

**Nuclear Option:**

1. Delete Vercel project completely
2. Wait 5 minutes
3. Re-import from GitHub
4. **IMMEDIATELY set Root Directory = client**
5. Deploy

### Test Commands:

```bash
# Test if React app loads
curl -I https://yourdomain.vercel.app/
# Should return 200 OK

# Test if SPA routing works
curl -I https://yourdomain.vercel.app/admin
# Should return 200 OK (not 404)

# Test direct file access
curl -I https://yourdomain.vercel.app/index.html
# Should return 200 OK
```

## 🔍 Troubleshooting

### If /admin still shows 404:

1. **Check Root Directory** in Vercel Dashboard
   - Go to: Project Settings → General
   - **Root Directory must be: `client`**

2. **If already set to `client`:**
   - Delete the Vercel project
   - Re-import from GitHub
   - Set Root Directory = `client` during import

3. **Clear Build Cache:**
   - Deployments tab → Redeploy → Check "Clear build cache"

4. **Test Direct File:**
   - Visit: `https://yourdomain.vercel.app/index.html`
   - If this works → routing issue (vercel.json)
   - If this fails → root directory issue

### SPA Routing Test:

```bash
# Test if Vercel serves the React app
curl -I https://yourdomain.vercel.app/admin
# Should return 200 OK (not 404)
```

## 🎯 Success Indicators

- ✅ `https://yourdomain.vercel.app/index.html` loads
- ✅ `https://yourdomain.vercel.app/admin` shows login/admin UI (not Vercel's 404 page)
- ✅ Browser console shows React app running (not "Page not found")
