import Stripe from 'stripe';
import { User } from '../models/User';
import { Subscription } from '../models/Subscription';

// Initialize Stripe with environment variable
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

// Interface for subscription data
interface SubscriptionData {
  userId: string;
  stripeSubId: string;
  plan: string;
  status: string;
  currentPeriodEnd: Date;
}

// Interface for usage event data
interface UsageEventData {
  userId: string;
  eventType: string;
  quantity: number;
  timestamp: Date;
}

// Interface for invoice data
interface InvoiceData {
  userId: string;
  stripeInvoiceId: string;
  amount: number;
  status: string;
  pdfUrl: string;
}

class BillingService {
  /**
   * Creates a Stripe Checkout Session for a subscription plan
   * @param userId - The ID of the user
   * @param plan - The subscription plan (free, pro, enterprise)
   * @param successUrl - URL to redirect to after successful payment
   * @param cancelUrl - URL to redirect to after cancelled payment
   * @returns The Stripe Checkout Session
   */
  static async createCheckoutSession(
    userId: string,
    plan: string,
    successUrl: string,
    cancelUrl: string
  ): Promise<Stripe.Checkout.Session> {
    try {
      // Find the user
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Define price IDs based on plan
      const priceIds: Record<string, string> = {
        free: process.env.STRIPE_PRICE_ID_FREE || '',
        pro: process.env.STRIPE_PRICE_ID_PRO || '',
        enterprise: process.env.STRIPE_PRICE_ID_ENTERPRISE || '',
      };

      const priceId = priceIds[plan];
      if (!priceId) {
        throw new Error('Invalid plan');
      }

      // Create checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'subscription',
        line_items: [
          {
            price: priceId,
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
      });

      return session;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }

  /**
   * Handles Stripe webhook events
   * @param payload - Raw webhook payload
   * @param signature - Webhook signature
   * @returns Response indicating success or failure
   */
  static async handleWebhook(
    payload: Buffer,
    signature: string
  ): Promise<{ received: boolean }> {
    try {
      // Verify webhook signature
      const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );

      // Handle different event types
      switch (event.type) {
        case 'invoice.paid':
          await this.handleInvoicePaid(event.data.object as Stripe.Invoice);
          break;
        case 'subscription.updated':
          await this.handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
          break;
        case 'subscription.deleted':
          await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
          break;
        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      return { received: true };
    } catch (error) {
      console.error('Error handling webhook:', error);
      throw error;
    }
  }

  /**
   * Handles invoice.paid webhook event
   * @param invoice - The invoice object from Stripe
   */
  private static async handleInvoicePaid(invoice: Stripe.Invoice): Promise<void> {
    try {
      const userId = invoice.metadata?.userId;
      if (!userId) {
        console.error('No userId in invoice metadata');
        return;
      }

      // Create or update invoice record
      const invoiceData: InvoiceData = {
        userId,
        stripeInvoiceId: invoice.id,
        amount: invoice.amount_paid / 100, // Convert from cents
        status: invoice.status || 'paid',
        pdfUrl: invoice.invoice_pdf || '',
      };

      // In a real application, you would save this to your database
      console.log('Invoice paid:', invoiceData);
    } catch (error) {
      console.error('Error handling invoice.paid event:', error);
      throw error;
    }
  }

  /**
   * Handles subscription.updated webhook event
   * @param subscription - The subscription object from Stripe
   */
  private static async handleSubscriptionUpdated(subscription: Stripe.Subscription): Promise<void> {
    try {
      const userId = subscription.metadata?.userId;
      if (!userId) {
        console.error('No userId in subscription metadata');
        return;
      }

      // Update subscription record
      const subscriptionData: SubscriptionData = {
        userId,
        stripeSubId: subscription.id,
        plan: subscription.items.data[0].price.nickname || 'unknown',
        status: subscription.status,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      };

      // In a real application, you would update this in your database
      console.log('Subscription updated:', subscriptionData);
    } catch (error) {
      console.error('Error handling subscription.updated event:', error);
      throw error;
    }
  }

  /**
   * Handles subscription.deleted webhook event
   * @param subscription - The subscription object from Stripe
   */
  private static async handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
    try {
      const userId = subscription.metadata?.userId;
      if (!userId) {
        console.error('No userId in subscription metadata');
        return;
      }

      // Update subscription record
      const subscriptionData: SubscriptionData = {
        userId,
        stripeSubId: subscription.id,
        plan: subscription.items.data[0].price.nickname || 'unknown',
        status: 'canceled',
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      };

      // In a real application, you would update this in your database
      console.log('Subscription deleted:', subscriptionData);
    } catch (error) {
      console.error('Error handling subscription.deleted event:', error);
      throw error;
    }
  }

  /**
   * Tracks a usage event for metered billing
   * @param userId - The ID of the user
   * @param eventType - The type of usage event
   * @param quantity - The quantity of the event
   */
  static async trackUsageEvent(
    userId: string,
    eventType: string,
    quantity: number
  ): Promise<void> {
    try {
      // In a real application, you would save this to your database
      const usageEventData: UsageEventData = {
        userId,
        eventType,
        quantity,
        timestamp: new Date(),
      };

      console.log('Usage event tracked:', usageEventData);

      // For metered billing, you would report this to Stripe
      // This is a placeholder for the actual implementation
      if (process.env.STRIPE_METERED_PRICE_ID) {
        // In a real implementation, you would call stripe.billingMeteredUsage.create()
        console.log('Reporting usage to Stripe:', { eventType, quantity });
      }
    } catch (error) {
      console.error('Error tracking usage event:', error);
      throw error;
    }
  }

  /**
   * Gets the customer portal URL for managing subscription
   * @param customerId - The Stripe customer ID
   * @param returnUrl - The URL to return to after portal
   * @returns The customer portal URL
   */
  static async getCustomerPortalUrl(
    customerId: string,
    returnUrl: string
  ): Promise<string> {
    try {
      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
      });

      return session.url;
    } catch (error) {
      console.error('Error creating customer portal session:', error);
      throw error;
    }
  }
}

export default BillingService;
```

```typescript