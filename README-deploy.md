# ShopSphere Deployment Guide

## Deploy to Vercel

1. Push code to a GitHub repository.
2. Log in to Vercel and import the project.
3. During setup:
   - Framework: Select "Next.js"
   - Root Directory: `/client`
   - Build Command: `cd ../server && npm run build && cd ../client && next build`
   - Output Directory: `out`
4. Add environment variables (see below).
5. Deploy.

## Environment Variables

Add these to Vercel project settings:

```
NEXT_PUBLIC_API_URL
NEXT_PUBLIC_CLIENT_URL
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
JWT_SECRET
JWT_REFRESH_SECRET
MONGODB_URI
RESEND_API_KEY
EMAIL_FROM
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
FACEBOOK_APP_ID
FACEBOOK_APP_SECRET
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_REGION
S3_BUCKET_NAME
GA4_MEASUREMENT_ID
REDIS_HOST
REDIS_PORT
REDIS_PASSWORD
```

## First-time Setup

1. Run database seed:
   ```bash
   cd server && node dist/db/seed.js
   ```
2. Ensure MongoDB is running and accessible via `MONGODB_URI`.
3. Set up Stripe webhook endpoint to `https://your-domain.com/api/webhook/stripe`.
4. Configure OAuth apps (Google/Facebook) with redirect URIs:
   - Google: `https://your-domain.com/api/auth/oauth/google/callback`
   - Facebook: `https://your-domain.com/api/auth/oauth/facebook/callback`
5. Deploy backend to Render/Railway using `server/package.json` and same env vars.
6. Update `NEXT_PUBLIC_API_URL` to point to deployed backend.

## Important Notes

- Frontend is in `/client`, backend in `/server`.
- Vercel serves frontend; backend must be deployed separately.
- API routes are proxied via `vercel.json` rewrites to `api/index.ts`.
- Use `httpOnly` cookies for JWTs — never expose secrets in browser.
- Change all placeholder keys before production deployment.