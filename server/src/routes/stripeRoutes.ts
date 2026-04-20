import { Router } from 'express';
import { createCheckoutSession, handleWebhook } from '../controllers/stripeController';
import { paymentLimiter } from '../middleware/security';

const router = Router();

// Create checkout session
router.post('/create-checkout-session', paymentLimiter, createCheckoutSession);

// Handle Stripe webhook
router.post('/webhook', handleWebhook);

export default router;
```

```typescript