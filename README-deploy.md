# Deploy to Vercel

1. Push code to a GitHub repository
2. Go to [vercel.com](https://vercel.com) and import the project from GitHub
3. Vercel will auto-detect Next.js and configure the build
4. Add environment variables in Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `RESEND_API_KEY`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `NEXT_PUBLIC_POSTHOG_KEY`
   - `NEXT_PUBLIC_POSTHOG_HOST`
   - `NEXT_PUBLIC_SENTRY_DSN`
5. Deploy the project

## Environment Variables

| Key | Required | Description |
|-----|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon key |
| `RESEND_API_KEY` | Yes | Resend API key for transactional emails |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Yes | Stripe publishable key |
| `STRIPE_SECRET_KEY` | Yes | Stripe secret key (server-side) |
| `STRIPE_WEBHOOK_SECRET` | Yes | Stripe webhook signing secret |
| `NEXT_PUBLIC_POSTHOG_KEY` | Yes | PostHog project key |
| `NEXT_PUBLIC_POSTHOG_HOST` | Yes | PostHog API host |
| `NEXT_PUBLIC_SENTRY_DSN` | Yes | Sentry DSN for error tracking |

## First-time setup

1. Run database migrations:
   ```bash
   npx supabase db push
   ```
2. Seed the database:
   ```bash
   npx supabase db seed
   ```
3. Enable Row Level Security (RLS) on all user-facing tables in Supabase dashboard
4. Set up Stripe webhook endpoint to point to your Vercel deployment URL:
   - Endpoint URL: `https://your-app.vercel.app/api/stripe/webhook`
   - Events: `checkout.session.completed`, `payment_intent.succeeded`