# ShopSphere Deployment Guide

## Deploy to Vercel

1. Fork or push this repository to your GitHub account
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click "New Project" and import the ShopSphere repository
4. Vercel will auto-detect the Vite/React frontend in the root
5. Set environment variables (from `.env.example`)
6. Click "Deploy"

## Environment Variables

Required variables:
- `CLIENT_URL` - Client base URL (e.g., https://shopsphere.vercel.app)
- `API_BASE_URL` - Backend API URL (e.g., https://shopsphere-api.onrender.com)
- `RESEND_API_KEY` - For transactional emails
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_PUBLIC_KEY` - Stripe publishable key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret
- `JWT_SECRET` - JWT signing secret
- `JWT_REFRESH_SECRET` - JWT refresh token secret
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- `FACEBOOK_APP_ID` - Facebook OAuth app ID
- `FACEBOOK_APP_SECRET` - Facebook OAuth app secret
- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key
- `AWS_REGION` - AWS region
- `S3_BUCKET_NAME` - S3 bucket name

## First-time setup

1. Deploy backend to Render/Railway with all environment variables
2. Run database migrations: `npm run migrate`
3. Seed database: `npm run seed`
4. Configure Stripe:
   - Set webhook endpoint to `https://your-api.com/api/stripe/webhook`
   - Copy webhook signing secret to `STRIPE_WEBHOOK_SECRET`
5. Configure OAuth:
   - Add redirect URIs in Google/Facebook developer consoles:
     - Google: `https://your-client.com/api/auth/oauth/google/callback`
     - Facebook: `https://your-client.com/api/auth/oauth/facebook/callback`
6. Update `API_BASE_URL` in client environment to point to deployed backend