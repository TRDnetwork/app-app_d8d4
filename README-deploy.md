# ShopSphere Deployment Guide

## Deploy to Vercel

1. Import the `client` directory as a new Vercel project from GitHub
2. Set the build command to `cd client && npm run build`
3. Set the output directory to `client/dist`
4. Add all environment variables from `.env.example` in the Vercel dashboard
5. Deploy the project

## Environment Variables

Required environment variables:

- `API_BASE_URL`: Backend API base URL (e.g., https://shopsphere-server.onrender.com)
- `BASE_URL`: Frontend base URL (e.g., https://shopsphere-client.vercel.app)
- `STRIPE_PUBLISHABLE_KEY`: Stripe publishable key for client-side payments
- `RESEND_API_KEY`: Resend API key for transactional emails
- `ALGOLIA_SEARCH_KEY`: Algolia search-only API key
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `FACEBOOK_APP_ID`: Facebook OAuth app ID

## First-time setup

1. Deploy the Express backend to Render or Railway first
2. Run database migrations and seed data:
   ```bash
   node server/src/db/seed.js
   ```
3. Configure Stripe webhook endpoint to point to your backend's `/api/stripe/webhook`
4. Set up CORS in backend to allow your Vercel frontend domain
5. Enable OAuth apps in Google/Facebook developer consoles with proper redirect URIs
6. Configure S3 bucket with proper CORS and IAM permissions
7. Index products in Algolia using the search service sync command