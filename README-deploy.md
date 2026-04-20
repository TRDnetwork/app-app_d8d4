# ShopSphere Deployment Guide

## Deploy to Vercel

1. **Import Project**
   - Go to [Vercel Dashboard](https://vercel.com)
   - Click "New Project" → "Import Git Repository"
   - Connect your GitHub account and select the ShopSphere repository

2. **Configure Environment Variables**
   - In the Vercel project settings, go to "Environment Variables"
   - Add all variables from `.env.example` with their actual values:
     - `NEXT_PUBLIC_API_URL`
     - `NEXT_PUBLIC_CLIENT_URL`
     - `STRIPE_SECRET_KEY`
     - `STRIPE_WEBHOOK_SECRET`
     - `GOOGLE_CLIENT_ID`
     - `GOOGLE_CLIENT_SECRET`
     - `FACEBOOK_APP_ID`
     - `FACEBOOK_APP_SECRET`
     - `JWT_SECRET`
     - `JWT_REFRESH_SECRET`
     - `AWS_ACCESS_KEY_ID`
     - `AWS_SECRET_ACCESS_KEY`
     - `S3_BUCKET_NAME`

3. **Set Build Configuration**
   - Framework Preset: `Next.js`
   - Build Command: `cd client && npm run build`
   - Output Directory: `client/out`
   - Install Command: `npm install`

4. **Deploy**
   - Click "Deploy" to start the first deployment
   - Once deployed, note the assigned URL (e.g., `shopsphere.vercel.app`)

## First-time Setup

1. **Database Initialization**
   - Run database migration scripts:
     ```bash
     cd db && node init.js
     ```
   - Seed sample data:
     ```bash
     node seed.js
     ```

2. **Backend Server**
   - The Express backend runs separately on Railway/Render
   - Ensure the backend URL is set as `NEXT_PUBLIC_API_URL`
   - Configure Stripe webhook endpoint in Stripe Dashboard to point to:
     ```
     https://your-backend-domain.com/api/webhook/stripe
     ```

3. **Search Indexing**
   - After deployment, trigger initial search index build:
     ```bash
     curl -X POST https://your-backend-domain.com/api/search/index
     ```

4. **Monitoring**
   - Configure Sentry for error tracking using `sentry.properties`
   - Set up health checks using `db/health.js` script
   - Enable performance monitoring in `server/src/middleware/performanceMonitor.ts`