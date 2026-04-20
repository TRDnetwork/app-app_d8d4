import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { 
  getPricingPage,
  createCheckoutSession,
  webhookHandler,
  reportUsage,
  getUsageDashboard,
  getCurrentPlan,
  updateSubscription,
  cancelSubscription,
  getInvoiceHistory,
  createBillingPortalSession,
  handleTrialExpiry
} from '../controllers/billingController';

const router = express.Router();

// Public routes
router.get('/pricing', getPricingPage);

// Authenticated routes
router.post('/create-checkout-session', authenticateToken, createCheckoutSession);
router.post('/webhook', express.raw({ type: 'application/json' }), webhookHandler);
router.post('/report-usage', authenticateToken, reportUsage);
router.get('/usage-dashboard', authenticateToken, getUsageDashboard);
router.get('/current-plan', authenticateToken, getCurrentPlan);
router.post('/update-subscription', authenticateToken, updateSubscription);
router.post('/cancel-subscription', authenticateToken, cancelSubscription);
router.get('/invoice-history', authenticateToken, getInvoiceHistory);
router.get('/billing-portal', authenticateToken, createBillingPortalSession);
router.post('/trial-expiry', authenticateToken, handleTrialExpiry);

export default router;
```

```typescript