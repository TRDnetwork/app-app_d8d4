// Payment configuration
export const paymentConfig = {
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    apiVersion: '2023-10-16',
  },
  paypal: {
    clientId: process.env.PAYPAL_CLIENT_ID,
    clientSecret: process.env.PAYPAL_CLIENT_SECRET,
    mode: process.env.PAYPAL_MODE || 'sandbox',
  },
};

// Validate required payment configuration
if (!paymentConfig.stripe.secretKey || !paymentConfig.stripe.webhookSecret) {
  throw new Error('Stripe configuration is incomplete. Payment processing will not work.');
}
```

```typescript
// SECURITY FIX: Use environment variables for notification configuration