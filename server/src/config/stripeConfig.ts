// Stripe configuration
export const stripeConfig = {
  secretKey: process.env.STRIPE_SECRET_KEY,
  publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  apiVersion: '2023-10-16',
};

// Validate required Stripe configuration
if (!stripeConfig.secretKey) {
  throw new Error('STRIPE_SECRET_KEY is required');
}

if (!stripeConfig.webhookSecret) {
  throw new Error('STRIPE_WEBHOOK_SECRET is required');
}
```

```typescript
// SECURITY FIX: Use environment variables for JWT configuration