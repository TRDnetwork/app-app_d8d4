import { Request, Response } from 'express';
import Stripe from 'stripe';
import { Subscription } from '../models/Subscription';
import { UsageEvent } from '../models/UsageEvent';
import { Invoice } from '../models/Invoice';
import { User } from '../models/User';
import { StatusCodes } from 'http-status-codes';
import { logger } from '../utils/logger';
import { config } from '../config/env';

// Initialize Stripe with environment variable
const stripe = new Stripe(config.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

// Pricing plans configuration
const PRICING_PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    features: ['Basic features', 'Limited usage'],
    stripePriceId: null,
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 29,
    features: ['All features', 'Unlimited usage', 'Priority support'],
    stripePriceId: config.STRIPE_PRO_PRICE_ID,
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99,
    features: ['All features', 'Unlimited usage', 'Dedicated support', 'Custom integrations'],
    stripePriceId: config.STRIPE_ENTERPRISE_PRICE_ID,
  },
};

// Get pricing plans
export const getPricingPlans = async (req: Request, res: Response) => {
  try {
    res.status(StatusCodes.OK).json({
      success: true,
      data: Object.values(PRICING_PLANS),
    });
  } catch (error: any) {
    logger.error('Error getting pricing plans:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to get pricing plans',
    });
  }
};

// Create Stripe Checkout Session for subscription
export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const { planId, successUrl, cancelUrl } = req.body;
    const userId = (req as any).user.id;

    // Validate plan
    const plan = PRICING_PLANS[planId as keyof typeof PRICING_PLANS];
    if (!plan || !plan.stripePriceId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid plan selected',
      });
    }

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'User not found',
      });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: plan.stripePriceId,
          quantity: 1,
        },
      ],
      customer_email: user.email,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId: userId,
        planId: planId,
      },
      allow_promotion_codes: true,
    });

    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        sessionId: session.id,
        url: session.url,
      },
    });
  } catch (error: any) {
    logger.error('Error creating checkout session:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to create checkout session',
    });
  }
};

// Handle Stripe webhook events
export const handleWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig!,
      config.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    logger.error('Webhook signature verification failed:', err.message);
    return res.status(StatusCodes.BAD_REQUEST).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'invoice.paid':
        // Handle successful payment
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaid(invoice);
        break;

      case 'invoice.payment_failed':
        // Handle failed payment
        const failedInvoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailed(failedInvoice);
        break;

      case 'subscription.created':
      case 'subscription.updated':
        // Handle subscription changes
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;

      case 'subscription.deleted':
        // Handle subscription cancellation
        const deletedSubscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(deletedSubscription);
        break;

      default:
        logger.info(`Unhandled event type: ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.json({ received: true });
  } catch (error) {
    logger.error('Error processing webhook event:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Webhook processing failed' });
  }
};

// Handle invoice paid event
const handleInvoicePaid = async (invoice: Stripe.Invoice) => {
  const subscriptionId = invoice.subscription as string;
  const customerId = invoice.customer as string;

  // Find subscription
  const subscription = await Subscription.findOne({ stripeSubId: subscriptionId });
  if (!subscription) {
    logger.error('Subscription not found:', subscriptionId);
    return;
  }

  // Update subscription status
  subscription.status = 'active';
  subscription.currentPeriodEnd = new Date(invoice.period_end * 1000);
  await subscription.save();

  // Create invoice record
  await Invoice.create({
    userId: subscription.userId,
    stripeInvoiceId: invoice.id,
    amount: invoice.total / 100, // Convert from cents
    status: 'paid',
    pdfUrl: invoice.invoice_pdf,
  });

  logger.info('Invoice paid processed:', { subscriptionId, invoiceId: invoice.id });
};

// Handle invoice payment failed event
const handleInvoicePaymentFailed = async (invoice: Stripe.Invoice) => {
  const subscriptionId = invoice.subscription as string;

  // Find subscription
  const subscription = await Subscription.findOne({ stripeSubId: subscriptionId });
  if (!subscription) {
    logger.error('Subscription not found:', subscriptionId);
    return;
  }

  // Update subscription status
  subscription.status = 'past_due';
  await subscription.save();

  // Create invoice record
  await Invoice.create({
    userId: subscription.userId,
    stripeInvoiceId: invoice.id,
    amount: invoice.total / 100, // Convert from cents
    status: 'failed',
    pdfUrl: invoice.invoice_pdf,
  });

  logger.info('Invoice payment failed processed:', { subscriptionId, invoiceId: invoice.id });
};

// Handle subscription updated event
const handleSubscriptionUpdated = async (subscription: Stripe.Subscription) => {
  const customerId = subscription.customer as string;
  const planId = subscription.items.data[0].price.product as string;

  // Find or create subscription
  let dbSubscription = await Subscription.findOne({ stripeSubId: subscription.id });
  if (!dbSubscription) {
    // Get user by customer ID
    const customer = await stripe.customers.retrieve(customerId);
    const email = (customer as Stripe.Customer).email;
    
    if (!email) {
      logger.error('Customer email not found:', customerId);
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      logger.error('User not found for email:', email);
      return;
    }

    // Create new subscription
    dbSubscription = new Subscription({
      userId: user._id,
      stripeSubId: subscription.id,
      plan: planId,
      status: subscription.status,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    });
  } else {
    // Update existing subscription
    dbSubscription.plan = planId;
    dbSubscription.status = subscription.status;
    dbSubscription.currentPeriodEnd = new Date(subscription.current_period_end * 1000);
  }

  await dbSubscription.save();
  logger.info('Subscription updated:', { subscriptionId: subscription.id, plan: planId });
};

// Handle subscription deleted event
const handleSubscriptionDeleted = async (subscription: Stripe.Subscription) => {
  // Find subscription
  const dbSubscription = await Subscription.findOne({ stripeSubId: subscription.id });
  if (!dbSubscription) {
    logger.error('Subscription not found:', subscription.id);
    return;
  }

  // Update subscription status
  dbSubscription.status = 'canceled';
  await dbSubscription.save();

  logger.info('Subscription deleted:', { subscriptionId: subscription.id });
};

// Track usage event
export const trackUsageEvent = async (req: Request, res: Response) => {
  try {
    const { eventType, quantity = 1 } = req.body;
    const userId = (req as any).user.id;

    // Validate event type
    const validEventTypes = ['api_call', 'storage_gb', 'active_user'];
    if (!validEventTypes.includes(eventType)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid event type',
      });
    }

    // Create usage event
    const usageEvent = new UsageEvent({
      userId,
      eventType,
      quantity,
      timestamp: new Date(),
    });

    await usageEvent.save();

    // Report to Stripe for metered billing
    if (eventType === 'api_call') {
      await reportUsageToStripe(userId, quantity);
    }

    res.status(StatusCodes.OK).json({
      success: true,
      data: usageEvent,
    });
  } catch (error: any) {
    logger.error('Error tracking usage event:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to track usage event',
    });
  }
};

// Report usage to Stripe for metered billing
const reportUsageToStripe = async (userId: string, quantity: number) => {
  try {
    // Get user's active subscription
    const subscription = await Subscription.findOne({ 
      userId, 
      status: 'active' 
    });
    
    if (!subscription) {
      logger.info('No active subscription for user:', userId);
      return;
    }

    // Get subscription from Stripe
    const stripeSubscription = await stripe.subscriptions.retrieve(subscription.stripeSubId);
    const subscriptionItemId = stripeSubscription.items.data[0].id;

    // Create usage record
    await stripe.subscriptionItems.createUsageRecord(subscriptionItemId, {
      quantity,
      timestamp: 'now',
      action: 'increment',
    });

    logger.info('Usage reported to Stripe:', { userId, quantity, subscriptionItemId });
  } catch (error: any) {
    logger.error('Error reporting usage to Stripe:', error);
    throw error;
  }
};

// Get current subscription
export const getCurrentSubscription = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    // Get subscription
    const subscription = await Subscription.findOne({ userId }).sort({ createdAt: -1 });
    if (!subscription) {
      return res.status(StatusCodes.OK).json({
        success: true,
        data: null,
      });
    }

    // Get plan details
    const plan = PRICING_PLANS[subscription.plan as keyof typeof PRICING_PLANS];

    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        ...subscription.toObject(),
        planDetails: plan,
      },
    });
  } catch (error: any) {
    logger.error('Error getting current subscription:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to get current subscription',
    });
  }
};

// Cancel subscription
export const cancelSubscription = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { feedback } = req.body;

    // Get subscription
    const subscription = await Subscription.findOne({ userId, status: 'active' });
    if (!subscription) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Active subscription not found',
      });
    }

    // Cancel subscription in Stripe
    await stripe.subscriptions.update(subscription.stripeSubId, {
      cancel_at_period_end: true,
    });

    // Update subscription status
    subscription.status = 'canceled';
    await subscription.save();

    // Log feedback if provided
    if (feedback) {
      logger.info('Subscription cancellation feedback:', { userId, feedback });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Subscription will be canceled at the end of the billing period',
    });
  } catch (error: any) {
    logger.error('Error canceling subscription:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to cancel subscription',
    });
  }
};

// Get usage statistics
export const getUsageStats = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate as string) : new Date();

    // Get usage events
    const usageEvents = await UsageEvent.find({
      userId,
      timestamp: { $gte: start, $lte: end },
    }).sort({ timestamp: -1 });

    // Group by event type and sum quantities
    const stats: Record<string, number> = {};
    usageEvents.forEach(event => {
      stats[event.eventType] = (stats[event.eventType] || 0) + event.quantity;
    });

    // Get subscription
    const subscription = await Subscription.findOne({ userId }).sort({ createdAt: -1 });

    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        stats,
        subscription: subscription ? subscription.plan : 'free',
        periodStart: start,
        periodEnd: end,
      },
    });
  } catch (error: any) {
    logger.error('Error getting usage stats:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to get usage stats',
    });
  }
};

// Get invoice history
export const getInvoiceHistory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const invoices = await Invoice.find({ userId }).sort({ createdAt: -1 });

    res.status(StatusCodes.OK).json({
      success: true,
      data: invoices,
    });
  } catch (error: any) {
    logger.error('Error getting invoice history:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to get invoice history',
    });
  }
};

// Upgrade subscription
export const upgradeSubscription = async (req: Request, res: Response) => {
  try {
    const { planId } = req.body;
    const userId = (req as any).user.id;

    // Validate plan
    const plan = PRICING_PLANS[planId as keyof typeof PRICING_PLANS];
    if (!plan || !plan.stripePriceId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid plan selected',
      });
    }

    // Get current subscription
    const subscription = await Subscription.findOne({ userId, status: 'active' });
    if (!subscription) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Active subscription not found',
      });
    }

    // Get Stripe subscription
    const stripeSubscription = await stripe.subscriptions.retrieve(subscription.stripeSubId);
    const subscriptionItemId = stripeSubscription.items.data[0].id;

    // Update subscription
    await stripe.subscriptions.update(subscription.stripeSubId, {
      items: [
        {
          id: subscriptionItemId,
          price: plan.stripePriceId,
        },
      ],
    });

    // Update database
    subscription.plan = planId;
    await subscription.save();

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Subscription upgraded successfully',
      data: subscription,
    });
  } catch (error: any) {
    logger.error('Error upgrading subscription:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to upgrade subscription',
    });
  }
};

// Downgrade subscription
export const downgradeSubscription = async (req: Request, res: Response) => {
  try {
    const { planId } = req.body;
    const userId = (req as any).user.id;

    // Validate plan
    const plan = PRICING_PLANS[planId as keyof typeof PRICING_PLANS];
    if (!plan || !plan.stripePriceId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid plan selected',
      });
    }

    // Get current subscription
    const subscription = await Subscription.findOne({ userId, status: 'active' });
    if (!subscription) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Active subscription not found',
      });
    }

    // Get Stripe subscription
    const stripeSubscription = await stripe.subscriptions.retrieve(subscription.stripeSubId);
    const subscriptionItemId = stripeSubscription.items.data[0].id;

    // Update subscription
    await stripe.subscriptions.update(subscription.stripeSubId, {
      items: [
        {
          id: subscriptionItemId,
          price: plan.stripePriceId,
        },
      ],
    });

    // Update database
    subscription.plan = planId;
    await subscription.save();

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Subscription downgraded successfully',
      data: subscription,
    });
  } catch (error: any) {
    logger.error('Error downgrading subscription:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to downgrade subscription',
    });
  }
};

// Get customer portal URL
export const getCustomerPortalUrl = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    // Get subscription
    const subscription = await Subscription.findOne({ userId, status: 'active' });
    if (!subscription) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Active subscription not found',
      });
    }

    // Create portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: subscription.stripeSubId,
      return_url: `${config.CLIENT_URL}/billing`,
    });

    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        url: portalSession.url,
      },
    });
  } catch (error: any) {
    logger.error('Error getting customer portal URL:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to get customer portal URL',
    });
  }
};

// Start free trial
export const startFreeTrial = async (req: Request, res: Response) => {
  try {
    const { planId } = req.body;
    const userId = (req as any).user.id;

    // Validate plan
    const plan = PRICING_PLANS[planId as keyof typeof PRICING_PLANS];
    if (!plan || !plan.stripePriceId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid plan selected',
      });
    }

    // Check if user already has a subscription
    const existingSubscription = await Subscription.findOne({ userId });
    if (existingSubscription) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'User already has a subscription',
      });
    }

    // Create trial subscription in Stripe
    const trialSubscription = await stripe.subscriptions.create({
      customer: (req as any).user.stripeCustomerId,
      items: [
        {
          price: plan.stripePriceId,
        },
      ],
      trial_period_days: 14, // 14-day trial
      metadata: {
        userId: userId,
        planId: planId,
      },
    });

    // Create subscription record
    const subscription = new Subscription({
      userId,
      stripeSubId: trialSubscription.id,
      plan: planId,
      status: 'trialing',
      currentPeriodEnd: new Date(trialSubscription.trial_end! * 1000),
    });

    await subscription.save();

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Free trial started successfully',
      data: subscription,
    });
  } catch (error: any) {
    logger.error('Error starting free trial:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to start free trial',
    });
  }
};

// Extend trial for engaged users
export const extendTrial = async (req: Request, res: Response) => {
  try {
    const { days } = req.body;
    const userId = (req as any).user.id;

    // Validate days
    if (days < 1 || days > 14) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid number of days. Must be between 1 and 14.',
      });
    }

    // Get subscription
    const subscription = await Subscription.findOne({ userId, status: 'trialing' });
    if (!subscription) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Active trial not found',
      });
    }

    // Extend trial period
    const newTrialEnd = new Date(subscription.currentPeriodEnd.getTime() + days * 24 * 60 * 60 * 1000);
    
    // Update subscription in Stripe
    await stripe.subscriptions.update(subscription.stripeSubId, {
      trial_end: Math.floor(newTrialEnd.getTime() / 1000),
    });

    // Update database
    subscription.currentPeriodEnd = newTrialEnd;
    await subscription.save();

    res.status(StatusCodes.OK).json({
      success: true,
      message: `Trial extended by ${days} days`,
      data: subscription,
    });
  } catch (error: any) {
    logger.error('Error extending trial:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to extend trial',
    });
  }
};
```

```typescript