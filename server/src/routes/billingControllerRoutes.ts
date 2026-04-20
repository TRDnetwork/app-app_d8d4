import { Router } from 'express';
import { protect } from '../middleware/auth';
import { getSubscription, getUsageEvents, getInvoices } from '../controllers/billingController';

const router = Router();

/**
 * GET /api/billing/subscription
 * Get the current user's subscription
 */
router.get('/subscription', protect, getSubscription);

/**
 * GET /api/billing/usage
 * Get the user's usage events
 */
router.get('/usage', protect, getUsageEvents);

/**
 * GET /api/billing/invoices
 * Get the user's invoices
 */
router.get('/invoices', protect, getInvoices);

export default router;
```

```typescript