# ShopSphere Deployment Guide

## Deploy to Vercel

1. Push code to a GitHub repository.
2. Log in to [Vercel](https://vercel.com) and click "New Project".
3. Import your GitHub repository.
4. Set the project name and ensure the root directory is correct.
5. Click "Deploy".

## Environment Variables

Add the following environment variables in the Vercel project settings under "Environment Variables":

| Key | Value |
|-----|-------|
| `VITE_STRIPE_PUBLISHABLE_KEY` | From Stripe Dashboard |
| `VITE_ALGOLIA_APP_ID` | From Algolia Dashboard |
| `VITE_ALGOLIA_SEARCH_KEY` | From Algolia Dashboard |

## First-time Setup

1. Deploy the Express backend to Railway or Render using the same GitHub repo and `server/` directory.
2. Set backend environment variables on Railway/Render:
   - All keys from `.env.example` except the `VITE_` prefixed ones
   - Ensure `MONGODB_URI` points to your MongoDB instance
3. Run database migrations and seed data:
   ```bash
   node server/src/db/seed.js
   ```
4. Configure Stripe:
   - Set webhook endpoint to `https://your-backend.onrender.com/api/stripe/webhook`
   - Verify and copy the webhook signing secret
5. Enable CORS in backend to allow your Vercel frontend URL.
6. Start the backend and ensure health check at `/api/health` returns 200.