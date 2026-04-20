import { Request, Response } from 'express';
import Stripe from 'stripe';
import { Subscription } from '../models/Subscription';
import { UsageEvent } from '../models/UsageEvent';
import { Invoice } from '../models/Invoice';
import { User } from '../models/User';
import { logger } from '../utils/logger';
import { config } from '../config/env';

// Initialize Stripe with validated config
const stripe = new Stripe(config.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

// Cache for webhook IDs to ensure idempotency
const webhookCache = new Map<string, boolean>();
const WEBHOOK_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Check if webhook has already been processed
const isWebhookProcessed = (id: string): boolean => {
  const isProcessed = webhookCache.get(id);
  if (isProcessed) {
    return true;
  }
  return false;
};

// Mark webhook as processed
const markWebhookProcessed = (id: string): void => {
  webhookCache.set(id, true);
  setTimeout(() => {
    webhookCache.delete(id);
  }, WEBHOOK_CACHE_TTL);
};

// Get pricing tiers
export const getPricingTiers = async (req: Request, res: Response) => {
  try {
    const pricing = {
      free: {
        name: 'Free',
        price: 0,
        features: [
          'Basic features',
          'Limited usage',
          'Community support'
        ],
        limits: {
          api_calls: 1000,
          storage_gb: 1,
          seats: 1
        }
      },
      pro: {
        name: 'Pro',
        price: 29,
        features: [
          'All Free features',
          'Advanced analytics',
          'Priority support',
          'Custom domains'
        ],
        limits: {
          api_calls: 10000,
          storage_gb: 10,
          seats: 5
        }
      },
      enterprise: {
        name: 'Enterprise',
        price: 99,
        features: [
          'All Pro features',
          'Dedicated account manager',
          'SLA guarantees',
          'Custom integrations'
        ],
        limits: {
          api_calls: -1, // unlimited
          storage_gb: -1, // unlimited
          seats: -1 // unlimited
        }
      }
    };

    res.json({
      success: true,
      data: pricing
    });
  } catch (error) {
    logger.error('Error getting pricing tiers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get pricing tiers'
    });
  }
};

// Create checkout session for subscription
export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const { plan, userId, successUrl, cancelUrl } = req.body;
    
    if (!plan || !userId) {
      return res.status(400).json({
        success: false,
        message: 'Plan and userId are required'
      });
    }

    // Validate user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Map plan to Stripe price ID
    const priceIds: Record<string, string> = {
      'pro': config.STRIPE_PRICE_PRO,
      'enterprise': config.STRIPE_PRICE_ENTERPRISE
    };

    const priceId = priceIds[plan];
    if (!priceId) {
      return res.status(400).json({
        success: false,
        message: 'Invalid plan'
      });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl || `${config.FRONTEND_URL}/billing?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${config.FRONTEND_URL}/pricing`,
      customer_email: user.email,
      metadata: {
        user_id: userId,
        plan: plan
      }
    });

    res.json({
      success: true,
      data: {
        sessionId: session.id
      }
    });
  } catch (error: any) {
    logger.error('Error creating checkout session:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create checkout session'
    });
  }
};

// Handle Stripe webhook events
export const handleWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];
  let event;

  // Verify webhook signature
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig!,
      config.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    logger.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Check for idempotency
  if (event.id && isWebhookProcessed(event.id)) {
    logger.info(`Webhook ${event.id} already processed`);
    return res.json({ received: true });
  }

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

    // Mark webhook as processed
    if (event.id) {
      markWebhookProcessed(event.id);
    }

    res.json({ received: true });
  } catch (error) {
    logger.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
};

// Handle invoice.paid event
const handleInvoicePaid = async (invoice: Stripe.Invoice) => {
  try {
    const subscriptionId = invoice.subscription as string;
    const customerEmail = invoice.customer_email;
    
    // Find subscription
    const subscription = await Subscription.findOne({ stripe_sub_id: subscriptionId });
    if (!subscription) {
      logger.warn(`Subscription not found for invoice: ${subscriptionId}`);
      return;
    }

    // Create invoice record
    const invoiceRecord = new Invoice({
      user_id: subscription.user_id,
      stripe_invoice_id: invoice.id,
      amount: invoice.total / 100, // Convert from cents
      status: 'paid',
      pdf_url: invoice.invoice_pdf
    });

    await invoiceRecord.save();

    // Update subscription status
    subscription.status = 'active';
    subscription.current_period_end = new Date(invoice.period_end * 1000);
    await subscription.save();

    logger.info(`Invoice paid processed for subscription: ${subscriptionId}`);
  } catch (error) {
    logger.error('Error handling invoice.paid:', error);
    throw error;
  }
};

// Handle subscription.updated event
const handleSubscriptionUpdated = async (subscription: Stripe.Subscription) => {
  try {
    // Find subscription
    const dbSubscription = await Subscription.findOne({ stripe_sub_id: subscription.id });
    if (!dbSubscription) {
      logger.warn(`Subscription not found for update: ${subscription.id}`);
      return;
    }

    // Update subscription status
    dbSubscription.status = subscription.status;
    dbSubscription.current_period_end = new Date(subscription.current_period_end * 1000);
    
    // Update plan if changed
    if (subscription.items.data[0]?.price.id === config.STRIPE_PRICE_PRO) {
      dbSubscription.plan = 'pro';
    } else if (subscription.items.data[0]?.price.id === config.STRIPE_PRICE_ENTERPRISE) {
      dbSubscription.plan = 'enterprise';
    }

    await dbSubscription.save();

    logger.info(`Subscription updated: ${subscription.id}`);
  } catch (error) {
    logger.error('Error handling subscription.updated:', error);
    throw error;
  }
};

// Handle subscription.deleted event
const handleSubscriptionDeleted = async (subscription: Stripe.Subscription) => {
  try {
    // Find subscription
    const dbSubscription = await Subscription.findOne({ stripe_sub_id: subscription.id });
    if (!dbSubscription) {
      logger.warn(`Subscription not found for deletion: ${subscription.id}`);
      return;
    }

    // Update subscription status
    dbSubscription.status = 'canceled';
    await dbSubscription.save();

    logger.info(`Subscription deleted: ${subscription.id}`);
  } catch (error) {
    logger.error('Error handling subscription.deleted:', error);
    throw error;
  }
};

// Track usage event
export const trackUsage = async (req: Request, res: Response) => {
  try {
    const { userId, eventType, quantity = 1 } = req.body;
    
    if (!userId || !eventType) {
      return res.status(400).json({
        success: false,
        message: 'userId and eventType are required'
      });
    }

    // Validate user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Create usage event
    const usageEvent = new UsageEvent({
      user_id: userId,
      event_type: eventType,
      quantity: quantity,
      timestamp: new Date()
    });

    await usageEvent.save();

    // Report to Stripe for metered billing
    const subscription = await Subscription.findOne({ 
      user_id: userId, 
      status: 'active' 
    });

    if (subscription) {
      try {
        await stripe.subscriptionItems.createUsageRecord(
          subscription.stripe_sub_id,
          {
            quantity: quantity,
            timestamp: Math.floor(Date.now() / 1000),
            action: 'increment'
          }
        );
      } catch (error) {
        logger.error('Error reporting usage to Stripe:', error);
      }
    }

    res.json({
      success: true,
      data: usageEvent
    });
  } catch (error) {
    logger.error('Error tracking usage:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track usage'
    });
  }
};

// Get usage stats for a user
export const getUsageStats = async (req: Request, res: Response) => {
  try {
    const { userId, startDate, endDate } = req.query;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'userId is required'
      });
    }

    const query: any = { user_id: userId };
    
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate as string);
      if (endDate) query.timestamp.$lte = new Date(endDate as string);
    }

    const usageEvents = await UsageEvent.find(query)
      .sort({ timestamp: -1 })
      .limit(100);

    // Calculate totals by event type
    const totals: Record<string, number> = {};
    usageEvents.forEach(event => {
      if (!totals[event.event_type]) {
        totals[event.event_type] = 0;
      }
      totals[event.event_type] += event.quantity;
    });

    res.json({
      success: true,
      data: {
        events: usageEvents,
        totals: totals
      }
    });
  } catch (error) {
    logger.error('Error getting usage stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get usage stats'
    });
  }
};

// Get customer billing info
export const getCustomerBillingInfo = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'userId is required'
      });
    }

    // Get user's subscription
    const subscription = await Subscription.findOne({ user_id: userId });
    
    // Get usage stats
    const usageStats = await getUsageStatsForUser(userId);
    
    // Get invoice history
    const invoices = await Invoice.find({ user_id: userId })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: {
        subscription: subscription ? {
          plan: subscription.plan,
          status: subscription.status,
          current_period_end: subscription.current_period_end,
          stripe_sub_id: subscription.stripe_sub_id
        } : null,
        usage: usageStats,
        invoices: invoices.map(invoice => ({
          id: invoice._id,
          stripe_invoice_id: invoice.stripe_invoice_id,
          amount: invoice.amount,
          status: invoice.status,
          pdf_url: invoice.pdf_url,
          createdAt: invoice.createdAt
        }))
      }
    });
  } catch (error) {
    logger.error('Error getting customer billing info:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get billing info'
    });
  }
};

// Upgrade subscription
export const upgradeSubscription = async (req: Request, res: Response) => {
  try {
    const { userId, newPlan } = req.body;
    
    if (!userId || !newPlan) {
      return res.status(400).json({
        success: false,
        message: 'userId and newPlan are required'
      });
    }

    // Validate user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get current subscription
    const subscription = await Subscription.findOne({ user_id: userId });
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'No active subscription found'
      });
    }

    // Map plan to Stripe price ID
    const priceIds: Record<string, string> = {
      'pro': config.STRIPE_PRICE_PRO,
      'enterprise': config.STRIPE_PRICE_ENTERPRISE
    };

    const priceId = priceIds[newPlan];
    if (!priceId) {
      return res.status(400).json({
        success: false,
        message: 'Invalid plan'
      });
    }

    // Update subscription in Stripe
    const updatedSubscription = await stripe.subscriptions.update(
      subscription.stripe_sub_id,
      {
        items: [
          {
            id: subscription.stripe_sub_id,
            price: priceId,
          },
        ],
      }
    );

    // Update subscription in database
    subscription.plan = newPlan;
    subscription.status = updatedSubscription.status;
    subscription.current_period_end = new Date(updatedSubscription.current_period_end * 1000);
    await subscription.save();

    res.json({
      success: true,
      data: {
        subscription: {
          plan: subscription.plan,
          status: subscription.status,
          current_period_end: subscription.current_period_end
        }
      }
    });
  } catch (error: any) {
    logger.error('Error upgrading subscription:', error);
    
    // Handle specific Stripe errors
    if (error.type === 'StripeCardError') {
      res.status(400).json({
        success: false,
        message: 'Payment failed: ' + error.message
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to upgrade subscription'
      });
    }
  }
};

// Cancel subscription
export const cancelSubscription = async (req: Request, res: Response) => {
  try {
    const { userId, feedback } = req.body;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'userId is required'
      });
    }

    // Validate user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get current subscription
    const subscription = await Subscription.findOne({ user_id: userId });
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'No active subscription found'
      });
    }

    // Cancel subscription in Stripe
    await stripe.subscriptions.update(
      subscription.stripe_sub_id,
      {
        cancel_at_period_end: true,
      }
    );

    // Update subscription in database
    subscription.status = 'canceled';
    await subscription.save();

    // Log feedback if provided
    if (feedback) {
      logger.info(`Subscription cancellation feedback from user ${userId}: ${feedback}`);
    }

    res.json({
      success: true,
      message: 'Subscription will be canceled at the end of the billing period'
    });
  } catch (error) {
    logger.error('Error canceling subscription:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel subscription'
    });
  }
};

// Resume subscription
export const resumeSubscription = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'userId is required'
      });
    }

    // Validate user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get current subscription
    const subscription = await Subscription.findOne({ user_id: userId });
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'No subscription found'
      });
    }

    // Check if subscription is canceled
    if (subscription.status !== 'canceled') {
      return res.status(400).json({
        success: false,
        message: 'Subscription is not canceled'
      });
    }

    // Resume subscription in Stripe
    await stripe.subscriptions.update(
      subscription.stripe_sub_id,
      {
        cancel_at_period_end: false,
      }
    );

    // Update subscription in database
    subscription.status = 'active';
    await subscription.save();

    res.json({
      success: true,
      message: 'Subscription has been resumed'
    });
  } catch (error) {
    logger.error('Error resuming subscription:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resume subscription'
    });
  }
};

// Get invoice PDF
export const getInvoicePdf = async (req: Request, res: Response) => {
  try {
    const { invoiceId } = req.params;
    
    // Find invoice
    const invoice = await Invoice.findOne({ _id: invoiceId, user_id: req.user.id });
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    // Redirect to Stripe invoice PDF
    if (invoice.pdf_url) {
      return res.redirect(invoice.pdf_url);
    } else {
      return res.status(404).json({
        success: false,
        message: 'Invoice PDF not available'
      });
    }
  } catch (error) {
    logger.error('Error getting invoice PDF:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get invoice PDF'
    });
  }