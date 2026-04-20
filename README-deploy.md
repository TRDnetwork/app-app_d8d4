# ShopSphere Deployment Guide

## Deploy to Vercel

1. Push your code to a GitHub repository
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project" and import your GitHub repository
4. Configure the project:
   - Framework: Vite (auto-detected)
   - Root Directory: `/client`
   - Build Command: `npm run build`
   - Output Directory: `dist` (or `build` if using CRA)
   - Install Command: `npm install`
5. Click "Deploy"

## Environment Variables

Add these environment variables in Vercel project settings:

| Key | Value |
|-----|-------|
| `API_BASE_URL` | Your backend API URL (e.g., `https://shopsphere-server.onrender.com`) |
| `STRIPE_PUBLISHABLE_KEY` | Your Stripe publishable key |
| `GOOGLE_CLIENT_ID` | Your Google OAuth client ID |
| `FACEBOOK_APP_ID` | Your Facebook App ID |

## First-time Setup

1. Deploy the backend first to Railway/Render:
   ```bash
   git push railway main
   ```
2. Run database migrations and seed data:
   ```bash
   # Connect to your MongoDB and run:
   node server/src/db/seed.js
   ```
3. Enable MongoDB Atlas search if using Atlas Search
4. Configure Stripe webhooks:
   - Go to [Stripe Webhooks](https://dashboard.stripe.com/webhooks)
   - Add endpoint: `https://shopsphere-server.onrender.com/api/stripe/webhook`
   - Use API version: `2023-10-16`
   - Copy the webhook secret to `STRIPE_WEBHOOK_SECRET`
5. Set up OAuth providers:
   - Google: Add `https://your-app.vercel.app/api/auth/oauth/google/callback` to authorized redirect URIs
   - Facebook: Add `https://your-app.vercel.app/api/auth/oauth/facebook/callback` to valid OAuth redirect URIs