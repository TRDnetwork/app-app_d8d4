# ShopSphere Deployment Guide

## Deploy to Vercel

1. **Import Project**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project" → "Import Git Repository"
   - Select the ShopSphere repository
   - Click "Continue"

2. **Configure Environment Variables**
   - In the Vercel dashboard, go to Settings → Environment Variables
   - Add all variables from `.env.example` with their production values:
     - `NEXT_PUBLIC_API_URL` - Your backend API URL
     - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
     - `NEXT_PUBLIC_RESEND_API_KEY` - Resend API key for emails
     - `NEXT_PUBLIC_APP_ENV` - Set to `production`

3. **Set Build Settings**
   - Framework: "Next.js"
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Once deployed, copy the production URL

## Environment Variables

Required environment variables for production:

| Variable | Description | Source |
|--------|-------------|--------|
| `NEXT_PUBLIC_API_URL` | Backend API endpoint | Your backend deployment URL |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe frontend key | [Stripe Dashboard](https://dashboard.stripe.com) |
| `STRIPE_SECRET_KEY` | Stripe backend secret | [Stripe Dashboard](https://dashboard.stripe.com) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | Generated when setting up webhook |
| `RESEND_API_KEY` | Email service API key | [Resend Dashboard](https://resend.com) |
| `JWT_SECRET` | JWT token signing key | Generate strong random string |
| `MONGODB_URI` | MongoDB connection string | [MongoDB Atlas](https://cloud.mongodb.com) |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | [Google Cloud Console](https://console.cloud.google.com) |
| `FACEBOOK_APP_ID` | Facebook App ID | [Facebook Developers](https://developers.facebook.com) |

## First-time Setup

1. **Database Initialization**
   - Ensure MongoDB is running or Atlas cluster is created
   - The application will automatically create collections on first run
   - Run seed script if needed: `npm run seed` in server directory

2. **Backend Deployment**
   - Deploy backend to Railway/Render:
     - Import server repository
     - Add same environment variables
     - Set PORT to 5000
     - Deploy service

3. **Stripe Webhook Configuration**
   - In Stripe Dashboard, go to Developers → Webhooks
   - Add endpoint: `https://your-domain.com/api/stripe/webhook`
   - Copy webhook signing secret and add to environment variables
   - Test with Stripe CLI

4. **OAuth Setup**
   - **Google**:
     - Create project in Google Cloud Console
     - Enable Google+ API
     - Create OAuth client ID
     - Add redirect URI: `https://your-domain.com/api/auth/google/callback`
   - **Facebook**:
     - Create app in Facebook Developers
     - Add Facebook Login product
     - Add redirect URI: `https://your-domain.com/api/auth/facebook/callback`

5. **Email Service**
   - Create account at Resend.com
   - Verify domain
   - Copy API key to environment variables

6. **Monitoring**
   - Set up Sentry for error tracking
   - Configure health check endpoint: `GET /api/health`
   - Set up alerting for critical errors