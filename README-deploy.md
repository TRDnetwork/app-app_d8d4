# ShopSphere Deployment Guide

## Deploy to Vercel

1. Push code to GitHub repository
2. Log in to Vercel dashboard (vercel.com)
3. Click "New Project" and import the ShopSphere repository
4. Configure project settings:
   - Framework: Auto-detected (Vite)
   - Root Directory: project root
   - Build Command: `npm run build` (in client directory)
   - Output Directory: `dist` (or `build` if using different config)
5. Add environment variables from `.env.example` (VITE_* variables only)
6. Click "Deploy"

## Environment Variables

### Frontend (Vercel Environment Variables)
- `VITE_API_BASE_URL`: Base URL of deployed backend API (e.g., `https://shopsphere-backend.onrender.com/api`)
- `VITE_STRIPE_PUBLIC_KEY`: Stripe public key for payment forms

### Backend (Set in backend hosting - Render/Railway)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token signing
- `JWT_REFRESH_SECRET`: Secret key for JWT refresh token signing
- `STRIPE_SECRET_KEY`: Stripe secret key for server-side payments
- `STRIPE_WEBHOOK_SECRET`: Stripe webhook signing secret
- `RESEND_API_KEY`: Resend API key for transactional emails
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
- `FACEBOOK_APP_ID`: Facebook App ID
- `FACEBOOK_APP_SECRET`: Facebook App secret
- `FRONTEND_URL`: Frontend URL for redirect URLs (e.g., `https://shopsphere.vercel.app`)
- `CLIENT_URL`: Same as FRONTEND_URL

## First-time Setup

1. Deploy backend service first (to Render/Railway) and obtain the base URL
2. Set backend environment variables in the backend hosting platform
3. Run database migrations and seed data:
   ```bash
   # SSH into backend or run via script
   node db/seed.js
   ```
4. Configure Stripe:
   - Set webhook endpoint to `https://shopsphere-backend.onrender.com/api/stripe/webhook`
   - Verify and copy the webhook secret to backend environment variables
5. Configure OAuth providers:
   - Set Google/Facebook OAuth redirect URLs to `/api/auth/oauth/callback`
   - Add credentials to backend environment variables
6. Deploy frontend to Vercel with frontend environment variables
7. Verify deployment by accessing the Vercel app URL