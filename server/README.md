# KALLAA Backend

A premium art marketplace backend built with Node.js, Express, TypeScript, and MongoDB.

## 🚀 Deployment on Railway

### Prerequisites

- MongoDB Atlas account (for database)
- Railway account (for hosting)

### Environment Variables

Set these in your Railway project settings under "Variables":

#### Required

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name
```

#### Optional (but recommended for production)

```
NODE_ENV=production
PORT=5000
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your_secure_password
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### MongoDB Setup

1. **Create MongoDB Atlas Cluster**
   - Go to [MongoDB Atlas](https://cloud.mongodb.com/)
   - Create a new cluster (free tier available)
   - Create database user with read/write permissions
   - Whitelist IP addresses (or use 0.0.0.0/0 for Railway)

2. **Get Connection String**
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<username>`, `<password>`, and `<database>` with your values

3. **Network Access**
   - In Atlas: Network Access → Add IP Address
   - Add `0.0.0.0/0` (allows all IPs - secure for Railway)

### Railway Deployment

1. **Connect Repository**
   - Create new Railway project
   - Connect your GitHub repository
   - Select the correct branch

2. **Set Environment Variables**
   - Go to Variables section in Railway dashboard
   - Add all required environment variables

3. **Deploy**
   - Railway will automatically detect and build your Node.js app
   - Check deployment logs for any errors

### CORS Configuration

The server is configured to allow requests from:

- **Development**: `http://localhost:5173`
- **Production**: `https://kallaa-w9et.vercel.app`

CORS is configured with:

- `credentials: true` (allows cookies and auth headers)
- Preflight request handling for all routes
- Origin validation

If you're getting CORS errors:

1. Ensure your frontend is running on an allowed origin
2. Check that requests include `withCredentials: true`
3. Verify the Railway URL matches the configured origins

### Troubleshooting

#### Database Connection Issues

```
❌ MongoDB Connection Failed: authentication failed
```

- Check username/password in connection string
- Ensure database user has correct permissions

```
❌ MongoDB Connection Failed: getaddrinfo ENOTFOUND
```

- Check cluster URL is correct
- Ensure cluster is not paused
- Check network access settings

#### Environment Variables

```
❌ CRITICAL: No MongoDB URI found
```

- Ensure `MONGO_URI` is set in Railway Variables
- Check variable name (case-sensitive)

#### Build Failures

```
ERROR: Transform failed with 1 error
```

- Check TypeScript compilation errors
- Ensure all dependencies are installed

### API Endpoints

Once deployed, your API will be available at:

```
https://your-railway-app.railway.app/api/
```

#### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user (protected)

#### Products

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)
- `POST /api/products/upload` - Upload product image (protected)

#### Orders

- `POST /api/orders` - Create order (protected)
- `GET /api/orders/user` - Get user orders (protected)
- `GET /api/orders` - Get all orders (admin only)
- `PUT /api/orders/:id/status` - Update order status (admin only)

#### Payments

- `POST /api/payments/create-order` - Create Razorpay order (protected)
- `POST /api/payments/verify` - Verify payment (protected)

### Health Check

Visit `https://your-app.railway.app/health` to verify deployment.

### Logs

Monitor your Railway logs for:

- ✅ MongoDB connected successfully
- ✅ Server running on port 5000
- ✅ Admin user created (first deployment only)

## 🛠️ Development

### Local Setup

1. **Clone repository**

```bash
git clone <your-repo>
cd kallaa
```

2. **Install dependencies**

```bash
cd server
npm install
```

3. **Environment setup**

```bash
cp .env.example .env
# Edit .env with your local MongoDB URI
```

4. **Start development server**

```bash
npm run dev
```

### Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run seed-admin` - Manually seed admin user

## 📁 Project Structure

```
server/
├── src/
│   ├── controllers/     # Route handlers
│   ├── middlewares/     # Express middlewares
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API routes
│   ├── config/         # Configuration files
│   ├── shared/         # Shared utilities
│   ├── auth.ts         # JWT utilities
│   ├── db.ts           # Database connection
│   └── index.ts        # Server entry point
├── .env.example        # Environment template
└── package.json
```

## 🔒 Security

- JWT authentication with httpOnly cookies
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting (consider implementing)
- CORS configuration
- Environment variable validation

## 📊 Monitoring

Monitor these metrics in Railway:

- Response times
- Error rates
- Database connection status
- Memory usage

## 🆘 Support

If you encounter issues:

1. Check Railway deployment logs
2. Verify environment variables are set correctly
3. Ensure MongoDB Atlas cluster is active
4. Check network access settings in MongoDB Atlas

For additional help, create an issue in the repository.
