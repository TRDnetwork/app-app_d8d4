import express from 'express';
import Stripe from 'stripe';
import Subscription from '../models/Subscription';
import UsageEvent from '../models/UsageEvent';
import Invoice from '../models/Invoice';
import { authenticateToken } from '../middleware/auth';
import { verifyStripeWebhook } from '../middleware/stripe';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

// Pricing configuration
const PRICING = {
  pro: {
    monthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID!,
    annual: process.env.STRIPE_PRO_ANNUAL_PRICE_ID!
  },
  enterprise: {
    monthly: process.env.STRIPE_ENTERPRISE_MONTHLY_PRICE_ID!,
    annual: process.env.STRIPE_ENTERPRISE_ANNUAL_PRICE_ID!
  }
};

// Get pricing information
router.get('/pricing', (req, res) => {
  res.json({
    plans: [
      {
        name: 'Free',
        price: 0,
        period: 'month',
        features: ['Basic features', 'Limited usage', 'Community support']
      },
      {
        name: 'Pro',
        price: 29,
        period: 'month',
        features: ['Advanced features', 'Higher limits', 'Priority support']
      },
      {
        name: 'Enterprise',
        price: 99,
        period: 'month',
        features: ['All Pro features', 'Custom integrations', 'Dedicated support']
      }
    ]
  });
});

// Create checkout session for subscription
router.post('/create-checkout-session', authenticateToken, async (req, res) => {
  const { plan, interval = 'monthly', success_url, cancel_url } = req.body;
  
  try {
    // Validate plan
    if (!['pro', 'enterprise'].includes(plan)) {
      return res.status(400).json({ error: 'Invalid plan' });
    }
    
    // Get price ID based on plan and interval
    const priceId = PRICING[plan as keyof typeof PRICING][interval as 'monthly' | 'annual'];
    if (!priceId) {
      return res.status(400).json({ error: 'Invalid interval' });
    }
    
    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: success_url,
      cancel_url: cancel_url,
      customer_email: req.user.email,
      metadata: {
        user_id: req.user.id,
        plan: plan,
        interval: interval
      },
      subscription_data: {
        trial_period_days: 14 // 14-day free trial
      }
    });
    
    res.json({ sessionId: session.id });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Get customer portal session
router.post('/customer-portal', authenticateToken, async (req, res) => {
  try {
    // Find user's subscription
    const subscription = await Subscription.findOne({ user_id: req.user.id });
    if (!subscription) {
      return res.status(404).json({ error: 'No subscription found' });
    }
    
    // Create portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_sub_id,
      return_url: `${process.env.CLIENT_URL}/billing`,
    });
    
    res.json({ url: portalSession.url });
  } catch (error: any) {
    console.error('Error creating customer portal session:', error);
    res.status(500).json({ error: 'Failed to create customer portal session' });
  }
});

// Get current subscription status
router.get('/subscription', authenticateToken, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ user_id: req.user.id });
    if (!subscription) {
      return res.json({ subscription: null });
    }
    
    res.json({ subscription });
  } catch (error: any) {
    console.error('Error fetching subscription:', error);
    res.status(500).json({ error: 'Failed to fetch subscription' });
  }
});

// Cancel subscription
router.post('/subscription/cancel', authenticateToken, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ user_id: req.user.id });
    if (!subscription) {
      return res.status(404).json({ error: 'No subscription found' });
    }
    
    // Cancel subscription in Stripe
    await stripe.subscriptions.update(subscription.stripe_sub_id, {
      cancel_at_period_end: true
    });
    
    // Update subscription status in database
    subscription.status = 'canceled';
    await subscription.save();
    
    res.json({ success: true, message: 'Subscription will be canceled at the end of the billing period' });
  } catch (error: any) {
    console.error('Error canceling subscription:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
});

// Webhook handler for Stripe events
router.post('/webhook', express.raw({ type: 'application/json' }), verifyStripeWebhook, async (req, res) => {
  const event = req.body;
  
  try {
    switch (event.type) {
      case 'invoice.paid':
        // Update invoice status
        const invoice = await Invoice.findOne({ stripe_invoice_id: event.data.object.id });
        if (invoice) {
          invoice.status = 'paid';
          await invoice.save();
        }
        break;
        
      case 'subscription.updated':
        // Update subscription status
        const subscriptionData = event.data.object;
        const subscription = await Subscription.findOne({ stripe_sub_id: subscriptionData.id });
        
        if (subscription) {
          subscription.plan = subscriptionData.items.data[0].price.nickname?.toLowerCase() as any;
          subscription.status = subscriptionData.status;
          subscription.current_period_end = new Date(subscriptionData.current_period_end * 1000);
          subscription.updated_at = new Date();
          await subscription.save();
        }
        break;
        
      case 'subscription.deleted':
        // Update subscription status
        const deletedSubscription = await Subscription.findOne({ stripe_sub_id: event.data.object.id });
        if (deletedSubscription) {
          deletedSubscription.status = 'canceled';
          deletedSubscription.updated_at = new Date();
          await deletedSubscription.save();
        }
        break;
        
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    
    // Return 200 to acknowledge receipt
    res.json({ received: true });
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

export default router;
```

```typescript