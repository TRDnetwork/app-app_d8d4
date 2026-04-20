import { config } from 'dotenv';

// Load environment variables
config();

// Validate required environment variables
const requiredVars = [
  'NODE_ENV',
  'PORT',
  'MONGODB_URI',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
  'STRIPE_SECRET_KEY',
  'STRIPE_PUBLISHABLE_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'RESEND_API_KEY',
  'EMAIL_FROM',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'FACEBOOK_APP_ID',
  'FACEBOOK_APP_SECRET',
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
  'AWS_REGION',
  'S3_BUCKET_NAME',
  'ALGOLIA_APP_ID',
  'ALGOLIA_ADMIN_KEY',
  'ALGOLIA_SEARCH_KEY',
  'SENTRY_DSN',
  'POSTHOG_API_KEY',
  'VITE_API_URL',
  'VITE_STRIPE_PUBLISHABLE_KEY',
  'VITE_SENTRY_DSN',
  'VITE_ALGOLIA_APP_ID',
  'VITE_ALGOLIA_SEARCH_KEY',
  'SUPABASE_CONNECTION_STRING',
  'OPENAI_API_KEY'
];

const missingVars = requiredVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('Missing required environment variables:', missingVars);
  process.exit(1);
}

// Export environment variables with types
export