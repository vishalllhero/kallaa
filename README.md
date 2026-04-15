# KALLAA - Luxury Art E-commerce Platform

A premium digital art marketplace built with React, Node.js, and modern web technologies.

## 🚀 Deployment Guide

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- GitHub account
- Vercel account (frontend)
- Render/Railway account (backend)

### 1. Backend Deployment (Render/Railway)

#### Option A: Render
1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set build settings:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add environment variables:
   ```
   NODE_ENV=production
   PORT=10000
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secret_jwt_key_here
   ```

#### Option B: Railway
1. Connect your GitHub repository to Railway
2. Create a new project
3. Add environment variables:
   ```
   NODE_ENV=production
   PORT=10000
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secret_jwt_key_here
   ```

### 2. Frontend Deployment (Vercel)

1. Connect your GitHub repository to Vercel
2. Create a new project from the `client/` directory
3. Set build settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add environment variables:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com
   ```

### 3. Update CORS Configuration

In `server/_core/index.ts`, update the CORS origins:

```typescript
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://your-frontend-url.vercel.app'] // Replace with your actual Vercel URL
    : true,
  credentials: true
}));
```

### 4. Database Setup

1. Create a MongoDB Atlas cluster
2. Get your connection string
3. Update the `MONGO_URI` environment variable

### 5. Environment Variables Summary

#### Backend (.env)
```bash
NODE_ENV=production
PORT=10000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_super_secret_jwt_key_here
```

#### Frontend (.env)
```bash
VITE_API_URL=https://your-backend-url.onrender.com
```

## 🔧 Development

### Local Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kallaa
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd client && npm install
   ```

3. **Set up environment variables**
   - Copy `.env` and update values
   - Copy `client/.env` and update values

4. **Start development servers**
   ```bash
   # Backend + Frontend
   npm run dev

   # Or separately:
   npm run dev:server  # Backend on :5000
   npm run dev:client  # Frontend on :5173
   ```

## 📋 Current Status

✅ **Working Features:**
- Product catalog display
- Product detail pages
- Image gallery with thumbnails
- Responsive design
- Admin dashboard
- User authentication
- Product management

⚠️ **Coming Soon:**
- Payment integration (Razorpay)
- Order management
- Email notifications
- Advanced search/filtering

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **Deployment**: Vercel (frontend), Render/Railway (backend)
- **Styling**: Tailwind CSS with custom luxury theme

## 📝 Scripts

- `npm run dev` - Start both frontend and backend in development
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run check` - TypeScript type checking
- `npm run format` - Code formatting with Prettier

## 🔒 Security

- CORS configured for production domains
- JWT authentication
- Input validation
- Secure headers
- No sensitive data exposed to frontend

## 🎨 Design Philosophy

KALLAA embodies luxury e-commerce with:
- Clean, minimal aesthetic
- Gold accent colors
- Smooth animations
- Premium typography
- Mobile-first responsive design

---

Built with ❤️ for the art world