import { Router } from 'express';
import { protect } from '../middleware/auth';
import billingService from '../services/billingService';

const router = Router();

/**
 * POST /api/billing/checkout-session
 * Create a Stripe Checkout Session for subscription
 */
router.post('/checkout-session', protect, async (req, res) => {
  try {
    const { plan, successUrl, cancelUrl } = req.body;

    // Validate input
    if (!plan || !successUrl || !cancelUrl) {
      return res.status(400).json({
        error: 'Missing required parameters: plan, successUrl, cancelUrl',
      });
    }

    if (!['free', 'pro', 'enterprise'].includes(plan)) {
      return res.status(400).json({
        error: 'Invalid plan. Must be one of: free, pro, enterprise',
      });
    }

    // Create checkout session
    const session = await billingService.createCheckoutSession(
      req.user.id,
      plan,
      successUrl,
      cancelUrl
    );

    res.json({ id: session.id });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({
      error: 'Failed to create checkout session',
      message: error.message,
    });
  }
});

/**
 * POST /api/billing/webhook
 * Handle Stripe webhook events
 */
router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  if (!sig) {
    return res.status(400).send('Missing Stripe signature');
  }

  try {
    // Handle webhook
    const response = await billingService.handleWebhook(
      req.body,
      sig
    );

    res.json(response);
  } catch (error: any) {
    console.error('Error handling webhook:', error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

/**
 * POST /api/billing/usage
 * Track a usage event for metered billing
 */
router.post('/usage', protect, async (req, res) => {
  try {
    const { eventType, quantity } = req.body;

    // Validate input
    if (!eventType || quantity === undefined) {
      return res.status(400).json({
        error: 'Missing required parameters: eventType, quantity',
      });
    }

    if (quantity <= 0) {
      return res.status(400).json({
        error: 'Quantity must be greater than 0',
      });
    }

    // Track usage event
    await billingService.trackUsageEvent(req.user.id, eventType, quantity);

    res.json({ success: true });
  } catch (error: any) {
    console.error('Error tracking usage event:', error);
    res.status(500).json({
      error: 'Failed to track usage event',
      message: error.message,
    });
  }
});

/**
 * GET /api/billing/customer-portal
 * Get the customer portal URL for managing subscription
 */
router.get('/customer-portal', protect, async (req, res) => {
  try {
    const { returnUrl } = req.query;

    if (!returnUrl || typeof returnUrl !== 'string') {
      return res.status(400).json({
        error: 'Missing or invalid returnUrl parameter',
      });
    }

    // In a real application, you would get the Stripe customer ID from your database
    // For this example, we'll use a placeholder
    const customerId = 'placeholder_customer_id';

    // Get customer portal URL
    const portalUrl = await billingService.getCustomerPortalUrl(customerId, returnUrl);

    res.json({ url: portalUrl });
  } catch (error: any) {
    console.error('Error getting customer portal URL:', error);
    res.status(500).json({
      error: 'Failed to get customer portal URL',
      message: error.message,
    });
  }
});

export default router;
```

```typescript