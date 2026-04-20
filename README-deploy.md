# ShopSphere Deployment Guide

## Deploy to Vercel

1. Push code to GitHub repository
2. Log in to Vercel and import the project from GitHub
3. Select the `client` directory as the root directory
4. Add environment variables from `.env.example` (only frontend variables)
5. Deploy

## Environment Variables

Set these in Vercel project settings:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_API_URL` | Backend API URL (e.g., `https://shopsphere-backend.onrender.com`) |
| `NEXT_PUBLIC_CLIENT_URL` | Vercel app URL (e.g., `https://shopsphere.vercel.app`) |
| `NEXT_PUBLIC_POSTHOG_KEY` | (Optional) PostHog project key |
| `NEXT_PUBLIC_POSTHOG_HOST` | (Optional) PostHog instance URL |
| `NEXT_PUBLIC_SENTRY_DSN` | (Optional) Sentry DSN for error tracking |

## First-time Setup

1. Deploy backend to Render or Railway using the `server` directory
2. Set all backend environment variables in the backend hosting platform
3. Run database seed script: `node db/seed.js` (connects to MongoDB URI)
4. Enable MongoDB Atlas search indexes for product search
5. Configure Stripe webhook endpoint: `https://shopsphere-backend.onrender.com/api/webhooks/stripe`
6. Set OAuth redirect URIs:
   - Google: `https://shopsphere.vercel.app/api/auth/callback/google`
   - Facebook: `https://shopsphere.vercel.app/api/auth/callback/facebook`
7. Verify email service configuration (Nodemailer)