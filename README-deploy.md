# ShopSphere Deployment Guide

## Deploy to Vercel

1. Push code to a GitHub repository
2. Log in to Vercel and import the project
3. During setup:
   - Framework: Select "Vite" (auto-detected)
   - Root directory: `/`
   - Build command: `npm run build` (will be detected)
   - Output directory: `dist` (for Vite) or `client/out` (if using custom build)

## Environment Variables

Add these environment variables in Vercel project settings:

### Required Variables:
- `VITE_API_URL`: Backend API URL (e.g., https://shopsphere-server.onrender.com/api)
- `VITE_CLIENT_URL`: Client URL (e.g., https://shopsphere.vercel.app)
- `VITE_STRIPE_PUBLISHABLE_KEY`: Stripe publishable key
- `VITE_ALGOLIA_APP_ID`: Algolia application ID
- `VITE_ALGOLIA_SEARCH_KEY`: Algolia search-only API key
- `VITE_SENTRY_DSN`: Sentry DSN for error tracking

## First-time Setup

### Backend Configuration
1. Deploy backend to Render/Railway with these environment variables:
   - All non-VITE_* variables from .env.example
   - Database connection string (MONGODB_URI)
   - Ensure Stripe webhook endpoint is configured at `/api/stripe/webhook`

### Database Initialization
1. Run database migrations:
   ```bash
   npm run migrate
   ```
2. Seed initial data:
   ```bash
   npm run seed
   ```

### Third-party Services
1. **Stripe**: 
   - Set up webhook endpoint pointing to your deployed backend
   - Use the webhook secret from your environment
2. **Resend**:
   - Configure domain and verify sender email
   - Use RESEND_API_KEY from environment
3. **Algolia**:
   - Create index named "products"
   - Use admin key for indexing, search key for frontend
4. **AWS S3**:
   - Create bucket for product images
   - Configure CORS policy to allow your client domain
   - Set up IAM user with limited S3 permissions

### Domain & SSL
- Connect custom domain in Vercel
- SSL certificate is automatically provisioned by Vercel

### Monitoring
- Configure Sentry for frontend error tracking
- Set up PostHog for product analytics
- Enable logging in backend deployment