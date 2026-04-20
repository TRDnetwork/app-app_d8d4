```ts
import Stripe from 'stripe';
import { config } from '../config/env';

// Validate Stripe config at module load
if (!config.STRIPE_SECRET_KEY?.startsWith('sk_')) {
  throw new Error('❌ Invalid or missing STRIPE_SECRET_KEY in environment variables');
}

if (!config.STRIPE_WEBHOOK_SECRET?.startsWith('whsec_')) {
  throw new Error('❌ Invalid or missing STRIPE_WEBHOOK_SECRET in environment variables');
}

const stripe = new Stripe(config.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
  typescript: true,
});

export { stripe };
```