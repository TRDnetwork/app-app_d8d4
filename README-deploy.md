# ShopSphere Deployment Guide

## Deploy to Vercel (Frontend)

1. Push code to GitHub repository
2. Log in to Vercel and import the project from GitHub
3. Set build command: `cd client && npm run build`
4. Set output directory: `client/dist`
5. Add environment variables from `.env.example` (prefix with `VITE_` for frontend vars)
6. Deploy

## Deploy to Railway (Backend)

1. Create new Railway project
2. Import from GitHub repository
3. Select `server` directory as service root
4. Set start command: `npm start`
5. Add environment variables from `.env.example` (all non-VITE vars)
6. Deploy

## First-time Setup

1. Run MongoDB schema migrations:
   ```bash
   # In server directory
   npx ts-node src/db/migrations/migrate.ts
   ```

2. Seed database with initial data:
   ```bash
   npx ts-node db/seed.js
   ```

3. Set up Stripe webhook:
   - In Stripe Dashboard, create webhook endpoint
   - URL: `https://your-backend-url.com/api/stripe/webhook`
   - Events: `checkout.session.completed`, `payment_intent.succeeded`
   - Copy webhook secret to `STRIPE_WEBHOOK_SECRET` env var

4. Configure OAuth providers:
   - Google: Create OAuth 2.0 Client ID, set redirect to `http://localhost:3000/api/auth/oauth/google/callback`
   - Facebook: Create app, set redirect to `http://localhost:3000/api/auth/oauth/facebook/callback`