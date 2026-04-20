import stripe from '../lib/stripe';
import { 
  Subscription, 
  UsageEvent, 
  Invoice, 
  PlanType, 
  SubscriptionStatus, 
  UsageEventType, 
  InvoiceStatus 
} from '../types/billing';
import { db } from '../lib/database';

/**
 * Billing service for managing subscriptions, usage tracking, and customer portal
 */
class BillingService {
  /**
   * Create a checkout session for a subscription plan
   */
  async createCheckoutSession(
    userId: string, 
    plan: PlanType,
    successUrl: string,
    cancelUrl: string
  ): Promise<{ sessionId: string }> {
    // Get user from database
    const user = await db.users.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Get plan configuration
    const planConfig = this.getPlanConfig(plan);
    if (!planConfig) {
      throw new Error('Invalid plan');
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: this.getStripePriceId(plan),
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: user.email,
      metadata: {
        userId: userId,
        plan: plan,
      },
      subscription_data: {
        metadata: {
          userId: userId,
          plan: plan,
        },
      },
    });

    return { sessionId: session.id };
  }

  /**
   * Handle Stripe webhook events
   */
  async handleWebhook(payload: Buffer, signature: string): Promise<void> {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET is not configured');
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (err: any) {
      throw new Error(`Webhook signature verification failed: ${err.message}`);
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
   * Handle invoice paid event
   */
  private async handleInvoicePaid(invoice: any): Promise<void> {
    const userId = invoice.metadata.userId;
    if (!userId) {
      console.log('No userId in invoice metadata');
      return;
    }

    // Create invoice record
    const invoiceRecord: Invoice = {
      id: `inv_${Date.now()}`,
      userId,
      stripeInvoiceId: invoice.id,
      amount: invoice.total / 100, // Convert cents to dollars
      status: InvoiceStatus.PAID,
      pdfUrl: invoice.invoice_pdf,
      createdAt: new Date(invoice.created * 1000),
      updatedAt: new Date(),
    };

    await db.invoices.create(invoiceRecord);

    // Update subscription status if needed
    const subscription = await db.subscriptions.findByUserId(userId);
    if (subscription && subscription.status === SubscriptionStatus.PAST_DUE) {
      await db.subscriptions.update(subscription.id, {
        status: SubscriptionStatus.ACTIVE,
        updatedAt: new Date(),
      });
    }
  }

  /**
   * Handle invoice payment failed event
   */
  private async handleInvoicePaymentFailed(invoice: any): Promise<void> {
    const userId = invoice.metadata.userId;
    if (!userId) {
      console.log('No userId in invoice metadata');
      return;
    }

    // Update invoice status
    const invoiceRecord = await db.invoices.findByStripeId(invoice.id);
    if (invoiceRecord) {
      await db.invoices.update(invoiceRecord.id, {
        status: InvoiceStatus.UNPAID,
        updatedAt: new Date(),
      });
    }

    // Update subscription status
    const subscription = await db.subscriptions.findByUserId(userId);
    if (subscription) {
      await db.subscriptions.update(subscription.id, {
        status: SubscriptionStatus.PAST_DUE,
        updatedAt: new Date(),
      });
    }
  }

  /**
   * Handle subscription updated event
   */
  private async handleSubscriptionUpdated(subscription: any): Promise<void> {
    const userId = subscription.metadata.userId;
    if (!userId) {
      console.log('No userId in subscription metadata');
      return;
    }

    const plan = subscription.metadata.plan as PlanType;
    const status = subscription.status as SubscriptionStatus;
    const currentPeriodEnd = new Date(subscription.current_period_end * 1000);

    // Update or create subscription record
    const existingSubscription = await db.subscriptions.findByUserId(userId);
    if (existingSubscription) {
      await db.subscriptions.update(existingSubscription.id, {
        stripeSubId: subscription.id,
        plan,
        status,
        currentPeriodEnd,
        updatedAt: new Date(),
      });
    } else {
      const newSubscription: Subscription = {
        id: `sub_${Date.now()}`,
        userId,
        stripeSubId: subscription.id,
        plan,
        status,
        currentPeriodEnd,
        createdAt: new Date(subscription.created * 1000),
        updatedAt: new Date(),
      };
      await db.subscriptions.create(newSubscription);
    }
  }

  /**
   * Handle subscription deleted event
   */
  private async handleSubscriptionDeleted(subscription: any): Promise<void> {
    const userId = subscription.metadata.userId;
    if (!userId) {
      console.log('No userId in subscription metadata');
      return;
    }

    // Update subscription status
    const existingSubscription = await db.subscriptions.findByUserId(userId);
    if (existingSubscription) {
      await db.subscriptions.update(existingSubscription.id, {
        status: SubscriptionStatus.CANCELLED,
        updatedAt: new Date(),
      });
    }
  }

  /**
   * Get current subscription for a user
   */
  async getSubscription(userId: string): Promise<Subscription | null> {
    return await db.subscriptions.findByUserId(userId);
  }

  /**
   * Get subscription plan configuration
   */
  getPlanConfig(plan: PlanType): PlanConfig | null {
    const plans: Record<PlanType, PlanConfig> = {
      [PlanType.FREE]: {
        type: PlanType.FREE,
        name: 'Free',
        price: 0,
        interval: 'month',
        features: [
          'Basic workout tracking',
          'Limited to 5 workouts per week',
          'Basic nutrition logging',
          'Standard reports'
        ],
        isMetered: false
      },
      [PlanType.PRO]: {
        type: PlanType.PRO,
        name: 'Pro',
        price: 9.99,
        interval: 'month',
        features: [
          'Unlimited workouts',
          'Advanced analytics',
          'Personalized workout plans',
          'Meal planning tools',
          'Progress tracking',
          'Export data'
        ],
        isMetered: false
      },
      [PlanType.ENTERPRISE]: {
        type: PlanType.ENTERPRISE,
        name: 'Enterprise',
        price: 29.99,
        interval: 'month',
        features: [
          'All Pro features',
          'Team management',
          'Advanced reporting',
          'API access',
          'Priority support',
          'Custom integrations'
        ],
        isMetered: false
      }
    };

    return plans[plan] || null;
  }

  /**
   * Get Stripe price ID for a plan
   */
  private getStripePriceId(plan: PlanType): string {
    const priceIds: Record<PlanType, string> = {
      [PlanType.FREE]: process.env.STRIPE_PRICE_FREE || '',
      [PlanType.PRO]: process.env.STRIPE_PRICE_PRO || '',
      [PlanType.ENTERPRISE]: process.env.STRIPE_PRICE_ENTERPRISE || ''
    };

    return priceIds[plan];
  }

  /**
   * Record a usage event for metered billing
   */
  async recordUsageEvent(
    userId: string,
    eventType: UsageEventType,
    quantity: number
  ): Promise<void> {
    // Create usage event record
    const usageEvent: UsageEvent = {
      id: `usage_${Date.now()}`,
      userId,
      eventType,
      quantity,
      timestamp: new Date(),
    };

    await db.usageEvents.create(usageEvent);

    // Report usage to Stripe for metered billing
    const subscription = await this.getSubscription(userId);
    if (subscription && this.getPlanConfig(subscription.plan)?.isMetered) {
      try {
        await stripe.subscriptionItems.createUsageRecord(
          this.getSubscriptionItemId(subscription.stripeSubId),
          {
            quantity,
            timestamp: Math.floor(Date.now() / 1000),
            action: 'increment',
          }
        );
      } catch (error) {
        console.error('Error reporting usage to Stripe:', error);
        // Don't throw error as we still want to record the event locally
      }
    }
  }

  /**
   * Get subscription item ID from Stripe subscription
   */
  private async getSubscriptionItemId(stripeSubId: string): Promise<string> {
    const subscription = await stripe.subscriptions.retrieve(stripeSubId);
    return subscription.items.data[0].id;
  }

  /**
   * Get usage events for a user
   */
  async getUsageEvents(
    userId: string,
    eventType?: UsageEventType,
    startDate?: Date,
    endDate?: Date
  ): Promise<UsageEvent[]> {
    return await db.usageEvents.findByUser(userId, eventType, startDate, endDate);
  }

  /**
   * Get invoice history for a user
   */
  async getInvoices(userId: string): Promise<Invoice[]> {
    return await db.invoices.findByUser(userId);
  }

  /**
   * Create a customer portal session
   */
  async createCustomerPortalSession(
    userId: string,
    config: CustomerPortalConfig
  ): Promise<CustomerPortalSession> {
    // Get user's subscription
    const subscription = await this.getSubscription(userId);
    if (!subscription) {
      throw new Error('User has no subscription');
    }

    // Create portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: await this.getStripeCustomerId(subscription.stripeSubId),
      return_url: config.returnUrl,
    });

    return { url: session.url };
  }

  /**
   * Get Stripe customer ID from subscription
   */
  private async getStripeCustomerId(stripeSubId: string): Promise<string> {
    const subscription = await stripe.subscriptions.retrieve(stripeSubId);
    return subscription.customer as string;
  }

  /**
   * Cancel a subscription
   */
  async cancelSubscription(userId: string, feedback?: string): Promise<void> {
    const subscription = await this.getSubscription(userId);
    if (!subscription) {
      throw new Error('User has no subscription');
    }

    // Cancel subscription in Stripe
    await stripe.subscriptions.update(subscription.stripeSubId, {
      cancel_at_period_end: true,
    });

    // Update subscription status
    await db.subscriptions.update(subscription.id, {
      status: SubscriptionStatus.CANCELLED,
      updatedAt: new Date(),
    });

    // Record cancellation feedback if provided
    if (feedback) {
      await db.subscriptionCancellations.create({
        id: `cancel_${Date.now()}`,
        userId,
        subscriptionId: subscription.id,
        feedback,
        createdAt: new Date(),
      });
    }
  }

  /**
   * Get current plan usage for a user
   */
  async getPlanUsage(userId: string): Promise<Record<string, number>> {
    const subscription = await this.getSubscription(userId);
    if (!subscription) {
      return {};
    }

    const planConfig = this.getPlanConfig(subscription.plan);
    if (!planConfig || !planConfig.isMetered) {
      return {};
    }

    // For metered plans, calculate usage
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const usageEvents = await this.getUsageEvents(userId, undefined, startOfMonth, now);
    
    const usage: Record<string, number> = {};
    for (const event of usageEvents) {
      if (!usage[event.eventType]) {
        usage[event.eventType] = 0;
      }
      usage[event.eventType] += event.quantity;
    }
    
    return usage;
  }

  /**
   * Check if user has exceeded usage limits
   */
  async checkUsageLimits(userId: string): Promise<Record<string, boolean>> {
    const subscription = await this.getSubscription(userId);
    if (!subscription) {
      return {};
    }

    const planConfig = this.getPlanConfig(subscription.plan);
    if (!planConfig || !planConfig.isMetered || !planConfig.usageLimit) {
      return {};
    }

    const usage = await this.getPlanUsage(userId);
    const limitsExceeded: Record<string, boolean> = {};
    
    for (const [eventType, quantity] of Object.entries(usage)) {
      limitsExceeded[eventType] = quantity > planConfig.usageLimit;
    }
    
    return limitsExceeded;
  }
}

export default new BillingService();
```

```typescript