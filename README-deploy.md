# ShopSphere Deployment Guide

## Deploy to Vercel

1. Push code to GitHub repository
2. Log in to Vercel and import the project from GitHub
3. During setup:
   - Framework Preset: Auto (detected as Vite)
   - Build Command: `npm run build` (monorepo-aware)
   - Output Directory: `client/dist` (Vite default)
4. Add environment variables (from `.env.example`) in Vercel dashboard
5. Deploy

## Environment Variables

Required in Vercel project settings:

| Key | Value |
|-----|-------|
| `VITE_STRIPE_PUBLISHABLE_KEY` | Your Stripe publishable key |
| `VITE_API_BASE_URL` | `/api` (proxy to backend) |

Backend variables must be set in Railway/Render:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `S3_BUCKET`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM`

## First-time Setup

1. Deploy backend to Railway or Render with all environment variables
2. Run database seeding:
   ```bash
   npm run seed --prefix server
   ```
3. Set up Stripe webhook:
   - Endpoint: `https://your-backend.onrender.com/api/stripe/webhook`
   - Events: `checkout.session.completed`, `payment_intent.succeeded`
4. Configure S3 bucket with public-read ACL for product images
5. Verify email SMTP settings with test email
6. Enable CORS in backend to allow Vercel app URL