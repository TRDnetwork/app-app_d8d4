import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import billingService from '../services/billingService';
import trialService from '../services/trialService';

const router = Router();

/**
 * Create a checkout session for a subscription plan
 */
router.post('/checkout', authenticate, async (req, res) => {
  try {
    const { plan, successUrl, cancelUrl } = req.body;
    const userId = (req as any).userId;
    
    if (!plan || !successUrl || !cancelUrl) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    const session = await billingService.createCheckoutSession(
      userId,
      plan,
      successUrl,
      cancelUrl
    );
    
    res.json(session);
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Handle Stripe webhook events
 */
router.post('/webhook', async (req, res) => {
  const signature = req.headers['stripe-signature'];
  if (!signature) {
    return res.status(400).send('Missing Stripe signature');
  }
  
  try {
    await billingService.handleWebhook(req.body, signature);
    res.json({ received: true });
  } catch (error: any) {
    console.error('Error handling webhook:', error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

/**
 * Get current subscription
 */
router.get('/subscription', authenticate, async (req, res) => {
  try {
    const userId = (req as any).userId;
    const subscription = await billingService.getSubscription(userId);
    
    if (!subscription) {
      return res.status(404).json({ error: 'No subscription found' });
    }
    
    res.json(subscription);
  } catch (error: any) {
    console.error('Error getting subscription:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get subscription plan configuration
 */
router.get('/plans', async (req, res) => {
  try {
    const plans = [
      billingService.getPlanConfig('free'),
      billingService.getPlanConfig('pro'),
      billingService.getPlanConfig('enterprise'),
    ].filter(Boolean);
    
    res.json(plans);
  } catch (error: any) {
    console.error('Error getting plans:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Record a usage event
 */
router.post('/usage', authenticate, async (req, res) => {
  try {
    const { eventType, quantity } = req.body;
    const userId = (req as any).userId;
    
    if (!eventType || quantity === undefined) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    await billingService.recordUsageEvent(userId, eventType, quantity);
    
    res.status(201).json({ success: true });
  } catch (error: any) {
    console.error('Error recording usage event:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get usage events
 */
router.get('/usage', authenticate, async (req, res) => {
  try {
    const userId = (req as any).userId;
    const { eventType, startDate, endDate } = req.query;
    
    const usageEvents = await billingService.getUsageEvents(
      userId,
      eventType as any,
      startDate ? new Date(startDate as string) : undefined,
      endDate ? new Date(endDate as string) : undefined
    );
    
    res.json(usageEvents);
  } catch (error: any) {
    console.error('Error getting usage events:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get invoice history
 */
router.get('/invoices', authenticate, async (req, res) => {
  try {
    const userId = (req as any).userId;
    const invoices = await billingService.getInvoices(userId);
    
    res.json(invoices);
  } catch (error: any) {
    console.error('Error getting invoices:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Create a customer portal session
 */
router.post('/portal', authenticate, async (req, res) => {
  try {
    const { returnUrl } = req.body;
    const userId = (req as any).userId;
    
    if (!returnUrl) {
      return res.status(400).json({ error: 'Return URL is required' });
    }
    
    const session = await billingService.createCustomerPortalSession(userId, {
      returnUrl,
    });
    
    res.json(session);
  } catch (error: any) {
    console.error('Error creating portal session:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Cancel a subscription
 */
router.post('/subscription/cancel', authenticate, async (req, res) => {
  try {
    const { feedback } = req.body;
    const userId = (req as any).userId;
    
    await billingService.cancelSubscription(userId, feedback);
    
    res.json({ success: true });
  } catch (error: any) {
    console.error('Error cancelling subscription:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Start a free trial
 */
router.post('/trial/start', authenticate, async (req, res) => {
  try {
    const userId = (req as any).userId;
    
    await trialService.startTrial(userId);
    
    res.json({ success: true });
  } catch (error: any) {
    console.error('Error starting trial:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Extend a trial
 */
router.post('/trial/extend', authenticate, async (req, res) => {
  try {
    const { days } = req.body;
    const userId = (req as any).userId;
    
    if (!days) {
      return res.status(400).json({ error: 'Days parameter is required' });
    }
    
    await trialService.extendTrial(userId, days);
    
    res.json({ success: true });
  } catch (error: any) {
    console.error('Error extending trial:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
```

```typescript