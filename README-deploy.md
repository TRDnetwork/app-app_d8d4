# ShopSphere Deployment Guide

## Deploy to Vercel
1. Push code to a GitHub repository
2. Log in to Vercel and click "New Project"
3. Import the GitHub repository
4. Set build command: `cd client && npm run build`
5. Set output directory: `client/dist`
6. Add environment variables (see below)
7. Click "Deploy"

## Environment Variables
Required environment variables (add in Vercel project settings > Environment Variables):

- `NODE_ENV` - Application environment (development/production)
- `BASE_URL` - Frontend URL (e.g., https://shopsphere.vercel.app)
- `API_BASE_URL` - Backend API URL (e.g., https://shopsphere-api.onrender.com/api)
- `STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `ALGOLIA_SEARCH_KEY` - Algolia search-only API key
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `FACEBOOK_APP_ID` - Facebook OAuth app ID

## First-time Setup
1. Deploy backend to Railway/Render first
2. Run database migrations and seed data:
   ```bash
   # After backend deployment
   node server/src/db/seed.js
   ```
3. Set up Stripe webhook endpoint:
   - In Stripe Dashboard, create webhook endpoint pointing to your backend URL
   - Endpoint URL: `https://your-backend-url.com/api/stripe/webhook`
   - Events to enable: `checkout.session.completed`, `payment_intent.succeeded`
4. Configure CORS in backend to allow your Vercel deployment URL
5. Enable OAuth redirect URIs in Google/Facebook developer consoles:
   - Google: `https://shopsphere.vercel.app/api/auth/oauth/google/callback`
   - Facebook: `https://shopsphere.vercel.app/api/auth/oauth/facebook/callback`