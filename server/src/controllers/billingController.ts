import { Request, Response } from 'express';
import Stripe from 'stripe';
import { User } from '../models/User';
import { Subscription } from '../models/Subscription';
import { UsageEvent } from '../models/UsageEvent';
import { Invoice } from '../models/Invoice';
import { apiResponse } from '../utils/apiResponse';
import { logger } from '../middleware/logging';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

// Track processed webhook events to prevent duplicates
const processedEvents = new Set<string>();

/**
 * Get pricing page with plan comparison
 */
export const getPricingPage = async (req: Request, res: Response) => {
  try {
    const plans = [
      {
        id: 'free',
        name: 'Free',
        price: 0,
        period: 'month',
        features: [
          'Basic workout tracking',
          '1 workout plan',
          '5 workout logs per month',
          'Email support'
        ],
        cta: 'Get Started'
      },
      {
        id: 'pro',
        name: 'Pro',
        price: 9.99,
        period: 'month',
        features: [
          'All Free features',
          'Unlimited workout plans',
          'Unlimited workout logs',
          'Advanced analytics',
          'Priority email support',
          'Mobile app access'
        ],
        cta: 'Start Free Trial'
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        price: 29.99,
        period: 'month',
        features: [
          'All Pro features',
          'Team collaboration',
          'Custom workout templates',
          'API access',
          'Dedicated account manager',
          '24/7 phone support'
        ],
        cta: 'Contact Sales'
      }
    ];

    res.json(apiResponse(200, 'Pricing plans retrieved successfully', { plans }));
  } catch (error: any) {
    logger.error('Error retrieving pricing plans:', error);
    res.status(500).json(apiResponse(500, error.message));
  }
};

/**
 * Create Stripe Checkout Session for plan selection
 */
export const createCheckoutSession = async (req: any, res: Response) => {
  try {
    const { planId, trialPeriodDays = 7 } = req.body;
    const userId = req.user.id;

    // Validate plan ID
    const validPlans = ['pro', 'enterprise'];
    if (!validPlans.includes(planId)) {
      return res.status(400).json(apiResponse(400, 'Invalid plan ID'));
    }

    // Find or create Stripe customer
    let customer = await stripe.customers.list({ email: req.user.email });
    let customerId: string;

    if (customer.data.length > 0) {
      customerId = customer.data[0].id;
    } else {
      const newCustomer = await stripe.customers.create({
        email: req.user.email,
        name: req.user.name,
        metadata: { userId: userId }
      });
      customerId = newCustomer.id;
    }

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: planId === 'pro' ? process.env.STRIPE_PRO_PRICE_ID : process.env.STRIPE_ENTERPRISE_PRICE_ID,
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_period_days: trialPeriodDays,
        metadata: {
          userId: userId,
          planId: planId
        }
      },
      success_url: `${process.env.FRONTEND_URL}/pricing?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/pricing`,
    });

    res.json(apiResponse(200, 'Checkout session created', { sessionId: session.id }));
  } catch (error: any) {
    logger.error('Error creating checkout session:', error);
    res.status(500).json(apiResponse(500, error.message));
  }
};

/**
 * Handle Stripe webhook events
 */
export const webhookHandler = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    logger.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Use idempotency key to prevent duplicate processing
  if (processedEvents.has(event.id)) {
    logger.info(`Webhook event already processed: ${event.id}`);
    return res.json({ received: true });
  }

  // Add event ID to processed set with TTL (1 hour)
  processedEvents.add(event.id);
  setTimeout(() => processedEvents.delete(event.id), 3600000);

  // Handle the event
  try {
    switch (event.type) {
      case 'invoice.paid':
        await handleInvoicePaid(event.data.object);
        break;
      case 'subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;
      case 'subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
      default:
        logger.info(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.json({ received: true });
  } catch (error) {
    logger.error('Error processing webhook event:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
};

/**
 * Handle invoice.paid event
 */
async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const subscriptionId = invoice.subscription as string;
  const customerId = invoice.customer as string;
  
  // Get customer metadata to find our user ID
  const customer = await stripe.customers.retrieve(customerId);
  const userId = (customer as any).metadata.userId;
  
  if (!userId) {
    throw new Error('User ID not found in customer metadata');
  }

  // Create or update subscription in our database
  let subscription = await Subscription.findOne({ stripe_sub_id: subscriptionId });
  
  if (!subscription) {
    // New subscription
    subscription = new Subscription({
      user_id: userId,
      stripe_sub_id: subscriptionId,
      plan: invoice.lines.data[0].price.nickname?.toLowerCase() || 'pro',
      status: 'active',
      current_period_end: new Date(invoice.period_end * 1000)
    });
  } else {
    // Update existing subscription
    subscription.status = 'active';
    subscription.current_period_end = new Date(invoice.period_end * 1000);
  }
  
  await subscription.save();

  // Create invoice record
  const invoiceRecord = new Invoice({
    user_id: userId,
    stripe_invoice_id: invoice.id,
    amount: invoice.amount_paid / 100, // Convert cents to dollars
    status: 'paid',
    pdf_url: invoice.invoice_pdf
  });
  
  await invoiceRecord.save();

  // Update user role
  await User.findByIdAndUpdate(userId, { 
    role: subscription.plan === 'enterprise' ? 'enterprise' : 'pro' 
  });
}

/**
 * Handle subscription.updated event
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const subscriptionId = subscription.id;
  const customerId = subscription.customer as string;
  
  // Get customer metadata to find our user ID
  const customer = await stripe.customers.retrieve(customerId);
  const userId = (customer as any).metadata.userId;
  
  if (!userId) {
    throw new Error('User ID not found in customer metadata');
  }

  // Update subscription in our database
  const sub = await Subscription.findOne({ stripe_sub_id: subscriptionId });
  
  if (sub) {
    sub.status = subscription.status;
    sub.current_period_end = new Date(subscription.current_period_end * 1000);
    
    // Update plan if changed
    if (subscription.items.data.length > 0) {
      const priceId = subscription.items.data[0].price.id;
      if (priceId === process.env.STRIPE_PRO_PRICE_ID) {
        sub.plan = 'pro';
      } else if (priceId === process.env.STRIPE_ENTERPRISE_PRICE_ID) {
        sub.plan = 'enterprise';
      }
    }
    
    await sub.save();
    
    // Update user role
    await User.findByIdAndUpdate(userId, { 
      role: sub.plan === 'enterprise' ? 'enterprise' : 'pro' 
    });
  }
}

/**
 * Handle subscription.deleted event
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const subscriptionId = subscription.id;
  const customerId = subscription.customer as string;
  
  // Get customer metadata to find our user ID
  const customer = await stripe.customers.retrieve(customerId);
  const userId = (customer as any).metadata.userId;
  
  if (!userId) {
    throw new Error('User ID not found in customer metadata');
  }

  // Update subscription status
  const sub = await Subscription.findOne({ stripe_sub_id: subscriptionId });
  
  if (sub) {
    sub.status = 'canceled';
    await sub.save();
    
    // Downgrade user role to free
    await User.findByIdAndUpdate(userId, { role: 'customer' });
  }
}

/**
 * Report usage to Stripe metered billing
 */
export const reportUsage = async (req: any, res: Response) => {
  try {
    const { eventType, quantity = 1 } = req.body;
    const userId = req.user.id;

    // Validate event type
    const validEventTypes = ['workout_log', 'workout_plan', 'api_call'];
    if (!validEventTypes.includes(eventType)) {
      return res.status(400).json(apiResponse(400, 'Invalid event type'));
    }

    // Find user's active subscription
    const subscription = await Subscription.findOne({ 
      user_id: userId, 
      status: 'active' 
    });
    
    if (!subscription) {
      return res.status(400).json(apiResponse(400, 'No active subscription found'));
    }

    // Record usage event
    const usageEvent = new UsageEvent({
      user_id: userId,
      event_type: eventType,
      quantity: quantity,
      timestamp: new Date()
    });
    
    await usageEvent.save();

    // Report to Stripe for metered billing
    // Note: In a real implementation, you would call stripe.subscriptionItems.createUsageRecord
    // For now, we'll just log that we would report it
    logger.info(`Would report ${quantity} ${eventType} events to Stripe for user ${userId}`);

    res.json(apiResponse(200, 'Usage reported successfully'));
  } catch (error: any) {
    logger.error('Error reporting usage:', error);
    res.status(500).json(apiResponse(500, error.message));
  }
};

/**
 * Get usage dashboard for customer
 */
export const getUsageDashboard = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    
    // Get current month's usage
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const usageEvents = await UsageEvent.find({
      user_id: userId,
      timestamp: { $gte: startOfMonth }
    }).sort({ timestamp: -1 });
    
    // Group by event type and sum quantities
    const usageStats = usageEvents.reduce((acc, event) => {
      if (!acc[event.event_type]) {
        acc[event.event_type] = 0;
      }
      acc[event.event_type] += event.quantity;
      return acc;
    }, {} as Record<string, number>);
    
    // Get subscription info
    const subscription = await Subscription.findOne({ user_id: userId });
    
    res.json(apiResponse(200, 'Usage dashboard retrieved', { 
      usageStats, 
      subscription 
    }));
  } catch (error: any) {
    logger.error('Error retrieving usage dashboard:', error);
    res.status(500).json(apiResponse(500, error.message));
  }
};

/**
 * Get current plan and usage stats
 */
export const getCurrentPlan = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    
    // Get user's subscription
    const subscription = await Subscription.findOne({ user_id: userId });
    
    if (!subscription) {
      return res.json(apiResponse(200, 'No active subscription', { 
        plan: 'free',
        status: 'inactive',
        current_period_end: null,
        usage: {}
      }));
    }
    
    // Get usage stats
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const usageEvents = await UsageEvent.find({
      user_id: userId,
      timestamp: { $gte: startOfMonth }
    });
    
    const usageStats = usageEvents.reduce((acc, event) => {
      if (!acc[event.event_type]) {
        acc[event.event_type] = 0;
      }
      acc[event.event_type] += event.quantity;
      return acc;
    }, {} as Record<string, number>);
    
    res.json(apiResponse(200, 'Current plan retrieved', { 
      plan: subscription.plan,
      status: subscription.status,
      current_period_end: subscription.current_period_end,
      usage: usageStats
    }));
  } catch (error: any) {
    logger.error('Error retrieving current plan:', error);
    res.status(500).json(apiResponse(500, error.message));
  }
};

/**
 * Upgrade or downgrade subscription
 */
export const updateSubscription = async (req: any, res: Response) => {
  try {
    const { planId } = req.body;
    const userId = req.user.id;
    
    // Validate plan ID
    const validPlans = ['pro', 'enterprise'];
    if (!validPlans.includes(planId)) {
      return res.status(400).json(apiResponse(400, 'Invalid plan ID'));
    }
    
    // Get user's subscription
    const subscription = await Subscription.findOne({ user_id: userId });
    
    if (!subscription) {
      return res.status(400).json(apiResponse(400, 'No active subscription found'));
    }
    
    // Get Stripe subscription
    const stripeSubscription = await stripe.subscriptions.retrieve(subscription.stripe_sub_id);
    
    // Get the price ID for the new plan
    const priceId = planId === 'pro' ? process.env.STRIPE_PRO_PRICE_ID : process.env.STRIPE_ENTERPRISE_PRICE_ID;
    
    // Update subscription
    await stripe.subscriptions.update(subscription.stripe_sub_id, {
      items: [{
        id: stripeSubscription.items.data[0].id,
        price: priceId
      }]
    });
    
    // Update our database
    subscription.plan = planId;
    await subscription.save();
    
    // Update user role
    await User.findByIdAndUpdate(userId, { 
      role: planId === 'enterprise' ? 'enterprise' : 'pro' 
    });
    
    res.json(apiResponse(200, 'Subscription updated successfully', { planId }));
  } catch (error: any) {
    logger.error('Error updating subscription:', error);
    res.status(500).json(apiResponse(500, error.message));
  }
};

/**
 * Cancel subscription with feedback
 */
export const cancelSubscription = async (req: any, res: Response) => {
  try {
    const { feedback } = req.body;
    const userId = req.user.id;
    
    // Get user's subscription
    const subscription = await Subscription.findOne({ user_id: userId });
    
    if (!subscription) {
      return res.status(400).json(apiResponse(400, 'No active subscription found'));
    }
    
    // Cancel subscription in Stripe
    await stripe.subscriptions.update(subscription.stripe_sub_id, {
      cancel_at_period_end: true
    });
    
    // Update our database
    subscription.status = 'canceled';
    await subscription.save();
    
    // Record feedback if provided
    if (feedback) {
      logger.info(`Cancellation feedback from user ${userId}: ${feedback}`);
    }
    
    // Update user role to free
    await User.findByIdAndUpdate(userId, { role: 'customer' });
    
    res.json(apiResponse(200, 'Subscription scheduled for cancellation'));
  } catch (error: any) {
    logger.error('Error canceling subscription:', error);
    res.status(500).json(apiResponse(500, error.message));
  }
};

/**
 * Get invoice history
 */
export const getInvoiceHistory = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    
    const invoices = await Invoice.find({ user_id: userId })
      .sort({ createdAt: -1 });
    
    res.json(apiResponse(200, 'Invoice history retrieved', { invoices }));
  } catch (error: any) {
    logger.error('Error retrieving invoice history:', error);
    res.status(500).json(apiResponse(500, error.message));
  }
};

/**
 * Update payment method via Stripe portal
 */
export const createBillingPortalSession = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    
    // Find user's Stripe customer
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json(apiResponse(404, 'User not found'));
    }
    
    let customer = await stripe.customers.list({ email: user.email });
    let customerId: string;
    
    if (customer.data.length > 0) {
      customerId = customer.data[0].id;
    } else {
      const newCustomer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: { userId: userId }
      });
      customerId = newCustomer.id;
    }
    
    // Create billing portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.FRONTEND_URL}/billing`,
    });
    
    res.json(apiResponse(200, 'Billing portal session created', { url: session.url }));
  } catch (error: any) {
    logger.error('Error creating billing portal session:', error);
    res.status(500).json(apiResponse(500, error.message));
  }
};

/**
 * Handle trial expiry
 */
export const handleTrialExpiry = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    
    // Find user's subscription
    const subscription = await Subscription.findOne({ user_id: userId });
    
    if (!subscription || subscription.status !== 'trialing') {
      return res.status(400).json(apiResponse(400, 'No active trial found'));
    }
    
    // In a real implementation, this would be triggered by a Stripe webhook
    // For now, we'll just update the subscription status
    subscription.status = 'active';
    await subscription.save();
    
    res.json(apiResponse(200, 'Trial extended successfully'));
  } catch (error: any) {
    logger.error('Error handling trial expiry:', error);
    res.status(500).json(apiResponse(500, error.message));
  }
};
```

```typescript