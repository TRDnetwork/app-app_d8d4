# ShopSphere Deployment Guide

## Deploy to Vercel

1. Push code to GitHub repository
2. Log in to Vercel dashboard (vercel.com)
3. Click "New Project" and import the repository
4. Set framework preset to "Vite" (auto-detected)
5. Add environment variables from `.env.example` (see below)
6. Set build command: `cd client && npm run build`
7. Set output directory: `client/dist`
8. Deploy

## Environment Variables

Required environment variables:

- `MONGODB_URI`: MongoDB connection string (from Atlas)
- `JWT_SECRET`: JWT signing secret (32+ characters)
- `JWT_REFRESH_SECRET`: JWT refresh token secret (32+ characters)
- `STRIPE_SECRET_KEY`: Stripe secret key (from Stripe dashboard)
- `STRIPE_PUBLISHABLE_KEY`: Stripe publishable key
- `STRIPE_WEBHOOK_SECRET`: Stripe webhook signing secret
- `RESEND_API_KEY`: Resend API key (from resend.com)
- `EMAIL_FROM`: Email sender address
- `FRONTEND_URL`: Production frontend URL (e.g., https://shopsphere.vercel.app)
- `API_BASE_URL`: Production API base URL (e.g., https://shopsphere-api.onrender.com/api)
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
- `FACEBOOK_APP_ID`: Facebook app ID
- `FACEBOOK_APP_SECRET`: Facebook app secret
- `AWS_ACCESS_KEY_ID`: AWS access key for S3
- `AWS_SECRET_ACCESS_KEY`: AWS secret key for S3
- `S3_BUCKET`: S3 bucket name for product images
- `S3_REGION`: AWS region for S3 bucket
- `ALGOLIA_APP_ID`: Algolia application ID
- `ALGOLIA_API_KEY`: Algolia admin API key
- `ALGOLIA_SEARCH_KEY`: Algolia search-only API key
- `ALGOLIA_INDEX_NAME`: Algolia index name for products

## First-time Setup

1. Deploy backend to Railway/Render first to get API base URL
2. Run database migrations:
   ```bash
   cd server && node db/migrate.js
   ```
3. Seed database with sample data:
   ```bash
   cd server && node db/seed.js
   ```
4. Configure Stripe webhooks:
   - Set webhook URL to `https://shopsphere-api.onrender.com/api/stripe/webhook`
   - Copy webhook signing secret to `STRIPE_WEBHOOK_SECRET`
5. Set up OAuth providers:
   - Google: Add authorized redirect URI `https://shopsphere.vercel.app/api/auth/oauth/google/callback`
   - Facebook: Add authorized redirect URI `https://shopsphere.vercel.app/api/auth/oauth/facebook/callback`
6. Configure CORS in backend to allow `https://shopsphere.vercel.app`