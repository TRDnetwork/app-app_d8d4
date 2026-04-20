# ShopSphere Deployment Guide

## Deploy to Vercel

1. Push code to GitHub repository
2. Log in to Vercel and import the project from GitHub
3. Select the `client` directory as the root directory
4. Set build command: `npm run build` (inherited from package.json)
5. Set output directory: `dist` (Vite default)
6. Add environment variables (see below)
7. Click "Deploy"

## Environment Variables

Required environment variables in Vercel project settings:

**Frontend (VITE_ prefixed):**
- `VITE_API_URL` - Backend API base URL (e.g. https://shopsphere-server.onrender.com)
- `VITE_CLIENT_URL` - Client base URL (e.g. https://shopsphere-client.vercel.app)

**Backend (must be configured separately on backend hosting):**
- `PORT`, `NODE_ENV`, `JWT_SECRET`, `JWT_REFRESH_SECRET`
- `MONGODB_URI` - MongoDB connection string
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `FACEBOOK_APP_ID`, `FACEBOOK_APP_SECRET`
- `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USERNAME`, `EMAIL_PASSWORD`, `EMAIL_FROM`
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PUBLIC_KEY`
- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `S3_BUCKET_NAME`

## First-time Setup

1. Deploy backend to Render/Railway with all environment variables
2. Run database migrations and seed data:
   ```bash
   npm run migrate
   npm run seed
   ```
3. Configure Stripe:
   - Set webhook endpoint to `https://shopsphere-server.onrender.com/api/stripe/webhook`
   - Use API keys in backend environment
4. Configure OAuth:
   - Set Google/Facebook callback URLs to `/api/auth/oauth/google/callback`
   - Add authorized domains to provider consoles
5. Enable CORS in backend to allow Vercel frontend domain
6. Verify email service configuration for transactional emails