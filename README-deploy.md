# ShopSphere Deployment Guide

## Deploy to Vercel

1. Push code to GitHub repository
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project" and import the repository
4. Select the `client` directory as root
5. Add environment variables (see below)
6. Click "Deploy"

Vercel will auto-detect Vite + React and use the build command from package.json.

## Environment Variables

Add these environment variables in Vercel project settings:

```
VITE_RESEND_API_KEY
VITE_STRIPE_PUBLISHABLE_KEY
VITE_CLIENT_URL
VITE_SERVER_URL
```

Note: Only client-side variables need `VITE_` prefix. Server-side keys (STRIPE_SECRET_KEY, JWT_SECRET, etc.) must be configured on the backend hosting (Railway/Render).

## First-time Setup

1. Deploy backend to Railway or Render:
   - Set all non-VITE environment variables
   - Run database migrations and seed data
   - Verify `/api/health` returns 200

2. Configure Stripe:
   - Set webhook endpoint to `https://shopsphere-server.onrender.com/api/stripe/webhook`
   - Use the same webhook secret as in env vars

3. Configure OAuth:
   - Set Google/Facebook callback URLs to `/api/auth/oauth/google/callback` and `/api/auth/oauth/facebook/callback`
   - Host must be `https://shopsphere-server.onrender.com`