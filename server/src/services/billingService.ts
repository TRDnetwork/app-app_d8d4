import Stripe from 'stripe';
import { User } from '../models/User';
import { Subscription } from '../models/Subscription';
import { UsageEvent } from '../models/UsageEvent';
import { Invoice } from '../models/Invoice';

// Initialize Stripe with environment variable
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

/**
 * Billing Service for TRD Network
 * Handles all subscription and billing operations
 */
class BillingService {
  /**
   * Create a Stripe Checkout Session for plan selection
   */
  static async createCheckoutSession(
    userId: string,
    planId: string,
    successUrl: string,
    cancelUrl: string
  ): Promise<{ sessionId: string }> {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Get the plan details
      const plan = this.getPlanById(planId);
      if (!plan) {
        throw new Error('Invalid plan');
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
          userId,
          planId,
        },
        allow_promotion_codes: true,
      });

      return { sessionId: session.id };
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }

  /**
   * Handle Stripe webhook events
   */
  static async handleWebhookEvent(payload: any, sig: string): Promise<void> {
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        payload,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      throw new Error(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'invoice.paid':
        await this.handleInvoicePaid(event.data.object);
        break;
      case 'invoice.payment_failed':
        await this.handleInvoicePaymentFailed(event.data.object);
        break;
      case 'customer.subscription.updated':
        await this.handleSubscriptionUpdated(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await this.handleSubscriptionDeleted(event.data.object);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  }

  /**
   * Handle invoice.paid event
   */
  private static async handleInvoicePaid(invoice: any): Promise<void> {
    const subscriptionId = invoice.subscription;
    const customerId = invoice.customer;
    const periodEnd = new Date(invoice.period_end * 1000);

    // Find subscription by Stripe subscription ID
    const subscription = await Subscription.findOne({ stripeSubId: subscriptionId });
    if (!subscription) {
      console.error('Subscription not found for invoice:', subscriptionId);
      return;
    }

    // Update subscription status and period end
    subscription.status = 'active';
    subscription.currentPeriodEnd = periodEnd;
    await subscription.save();

    // Create invoice record
    await Invoice.create({
      userId: subscription.userId,
      stripeInvoiceId: invoice.id,
      amount: invoice.total / 100, // Convert from cents
      status: 'paid',
      pdfUrl: invoice.invoice_pdf,
    });

    console.log(`Invoice paid for subscription: ${subscriptionId}`);
  }

  /**
   * Handle invoice.payment_failed event
   */
  private static async handleInvoicePaymentFailed(invoice: any): Promise<void> {
    const subscriptionId = invoice.subscription;
    
    // Find subscription by Stripe subscription ID
    const subscription = await Subscription.findOne({ stripeSubId: subscriptionId });
    if (!subscription) {
      console.error('Subscription not found for failed invoice:', subscriptionId);
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

    console.log(`Invoice payment failed for subscription: ${subscriptionId}`);
  }

  /**
   * Handle customer.subscription.updated event
   */
  private static async handleSubscriptionUpdated(subscription: any): Promise<void> {
    // Find subscription by Stripe subscription ID
    const dbSubscription = await Subscription.findOne({ stripeSubId: subscription.id });
    if (!dbSubscription) {
      console.error('Subscription not found:', subscription.id);
      return;
    }

    // Update subscription status
    dbSubscription.status = subscription.status;
    dbSubscription.currentPeriodEnd = new Date(subscription.current_period_end * 1000);
    await dbSubscription.save();

    console.log(`Subscription updated: ${subscription.id}, status: ${subscription.status}`);
  }

  /**
   * Handle customer.subscription.deleted event
   */
  private static async handleSubscriptionDeleted(subscription: any): Promise<void> {
    // Find subscription by Stripe subscription ID
    const dbSubscription = await Subscription.findOne({ stripeSubId: subscription.id });
    if (!dbSubscription) {
      console.error('Subscription not found:', subscription.id);
      return;
    }

    // Update subscription status
    dbSubscription.status = 'canceled';
    await dbSubscription.save();

    console.log(`Subscription canceled: ${subscription.id}`);
  }

  /**
   * Report usage to Stripe for metered billing
   */
  static async reportUsage(
    subscriptionId: string,
    quantity: number,
    timestamp: number,
    action: 'increment' | 'set' = 'increment'
  ): Promise<void> {
    try {
      await stripe.subscriptionItems.createUsageRecord(subscriptionId, {
        quantity,
        timestamp,
        action,
      });

      // Record usage event in database
      await UsageEvent.create({
        userId: (await Subscription.findOne({ stripeSubId: subscriptionId }))?.userId,
        eventType: 'api_call',
        quantity,
        timestamp: new Date(timestamp * 1000),
      });

      console