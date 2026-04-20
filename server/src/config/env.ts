```ts
import { z } from 'zod';

const envSchema = z.object({
  // Server
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),

  // JWT
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('15m'),
  REFRESH_TOKEN_SECRET: z.string().min(32, 'REFRESH_TOKEN_SECRET must be at least 32 characters'),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default('7d'),

  // Database
  MONGODB_URI: z.string().url().min(1, 'MONGODB_URI is required'),

  // OAuth
  GOOGLE_CLIENT_ID: z.string().min(1, 'GOOGLE_CLIENT_ID is required'),
  GOOGLE_CLIENT_SECRET: z.string().min(1, 'GOOGLE_CLIENT_SECRET is required'),
  FACEBOOK_APP_ID: z.string().min(1, 'FACEBOOK_APP_ID is required'),
  FACEBOOK_APP_SECRET: z.string().min(1, 'FACEBOOK_APP_SECRET is required'),
  OAUTH_CALLBACK_URL: z.string().url(),

  // Stripe
  STRIPE_SECRET_KEY: z.string().startsWith('sk_').min(1, 'STRIPE_SECRET_KEY must start with sk_'),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith('whsec_').min(1, 'STRIPE_WEBHOOK_SECRET must start with whsec_'),
  STRIPE_PUBLIC_KEY: z.string().startsWith('pk_').min(1, 'STRIPE_PUBLIC_KEY must start with pk_'),

  // AWS
  AWS_ACCESS_KEY_ID: z.string().min(1, 'AWS_ACCESS_KEY_ID is required'),
  AWS_SECRET_ACCESS_KEY: z.string().min(1, 'AWS_SECRET_ACCESS_KEY is required'),
  AWS_REGION: z.string().default('us-east-1'),
  S3_BUCKET_NAME: z.string().min(1, 'S3_BUCKET_NAME is required'),

  // Email
  RESEND_API_KEY: z.string().startsWith('re_').min(1, 'RESEND_API_KEY must start with re_'),
  EMAIL_FROM: z.string().email(),

  // Search
  ALGOLIA_APP_ID: z.string().min(1, 'ALGOLIA_APP_ID is required'),
  ALGOLIA_ADMIN_KEY: z.string().min(1, 'ALGOLIA_ADMIN_KEY is required'),
  ALGOLIA_SEARCH_KEY: z.string().min(1, 'ALGOLIA_SEARCH_KEY is required'),
  ALGOLIA_INDEX_NAME: z.string().default('products'),

  // Security
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(15 * 60 * 1000), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(100),
  AUTH_RATE_LIMIT_MAX: z.coerce.number().default(10), // Stricter for auth
  PAYMENT_RATE_LIMIT_MAX: z.coerce.number().default(20),
});

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}

let env;

try {
  const parsed = envSchema.parse(process.env);
  env = new Proxy(parsed, {
    get(target, prop) {
      if (typeof prop !== 'string') return undefined;
      // Block accidental exposure of secrets
      if (prop.includes('SECRET') || prop.includes('KEY') || prop.includes('PASSWORD')) {
        return '[REDACTED]';
      }
      return target[prop as keyof typeof target];
    },
  });
  process.env = { ...process.env, ...parsed };
} catch (error: any) {
  console.error('❌ Invalid environment variables:', error.errors);
  process.exit(1);
}

export const config = env;
```