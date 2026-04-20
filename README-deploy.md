# ShopSphere Deployment Guide

## Deploy to Vercel

1. Push code to a GitHub repository
2. Log in to Vercel and import the project
3. Vercel will auto-detect Next.js and use `npm run build` from client/package.json
4. Set environment variables in Vercel dashboard (see below)
5. Deploy

## Environment Variables

Required in Vercel project settings:

**Frontend:**
- `NEXT_PUBLIC_API_URL` – Base URL for Express backend (e.g., `https://your-backend.onrender.com`)
- `NEXT_PUBLIC_CLIENT_URL` – Your deployed frontend URL (e.g., `https://shopsphere.vercel.app`)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` – Stripe publishable key

**Backend:**  
*(Deploy backend separately on Render/Railway with these vars)*
- `PORT`, `NODE_ENV`, `JWT_SECRET`, `JWT_REFRESH_SECRET`
- `MONGODB_URI` – Connection string for MongoDB Atlas
- OAuth keys: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, etc.
- Email SMTP credentials
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- AWS S3 credentials and `S3_BUCKET_NAME`

## First-time Setup

1. Run database migrations and seed data:
   ```bash
   cd server
   npm run migrate:reset
   ```

2. Deploy backend to Render/Railway with persistent MongoDB (Atlas recommended)

3. Configure Stripe:
   - Set webhook endpoint to `https://your-backend.com/api/webhooks/stripe`
   - Use Stripe CLI to test webhooks locally

4. Enable OAuth logins:
   - Register app with Google/Facebook Developer consoles
   - Add redirect URIs: `/api/auth/oauth/google/callback`, `/api/auth/oauth/facebook/callback`

5. Set up AWS S3:
   - Create bucket with public read access for product images
   - Configure CORS policy to allow your frontend domain