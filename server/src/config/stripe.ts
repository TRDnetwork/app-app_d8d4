import Stripe from 'stripe';

// Initialize Stripe with the current API version
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16', // Updated to current version
  // Use environment variable for API key
  apiKey: process.env.STRIPE_SECRET_KEY,
});

export default stripe;
```

```typescript