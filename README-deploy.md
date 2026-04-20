# ShopSphere Deployment Guide

## Deploy to Vercel

1. Push code to GitHub repository
2. Log in to Vercel and import the project from GitHub
3. During setup:
   - Framework: Select "Vite" (auto-detected)
   - Build command: `npm run build` (in client directory)
   - Output directory: `dist`
4. Add environment variables (from .env.example)
5. Click "Deploy"

## Environment Variables

Required frontend environment variables:
- `VITE_API_URL` - Express backend URL (e.g., Render/ Railway deployment)
- `VITE_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `VITE_SENTRY_DSN` - Sentry error tracking DSN
- `VITE_POSTHOG_API_KEY` - PostHog analytics API key
- `VITE_ALGOLIA_APP_ID` - Algolia search application ID
- `VITE_ALGOLIA_SEARCH_KEY` - Algolia search-only API key

## First-time setup

1. Deploy backend to Render/Railway:
   - Set all required environment variables in server .env
   - Run database migrations and seed data
   - Verify health check at `/api/health`

2. Configure third-party services:
   - Stripe: Set webhook endpoint to `https://your-server.com/api/stripe/webhook`
   - PostHog: Create project and copy API key
   - Sentry: Create project and copy DSN
   - Algolia: Create index and set up API keys

3. Update `VITE_API_URL` in Vercel project settings to point to deployed backend

4. Test full user flow: registration → product browse → cart → checkout → order confirmation