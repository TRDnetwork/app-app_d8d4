const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const User = require('../models/User');

class StripeService {
  static async createCheckoutSession(userId, { addressId, deliveryMethod, couponCode }) {
    try {
      // Fetch user and cart
      const [user, cart] = await Promise.all([
        User.findById(userId),
        Cart.findOne({ user_id: userId }).populate('items.product_id')
      ]);

      if (!user || !cart || cart.items.length === 0) {
        throw new Error('Cart is empty or user not found');
      }

      // Calculate order amounts
      const subtotal = cart.items.reduce((sum, item) => {
        const price = item.product_id.price * (1 - (item.product_id.discount_percent || 0) / 100);
        return sum + (price * item.quantity);
      }, 0);

      const shippingCosts = {
        standard: 0,
        express: 9.99,
        'same-day': 19.99
      };

      const shippingCost = shippingCosts[deliveryMethod] || 0;
      const tax = subtotal * 0.1; // 10% tax
      const total = Math.round((subtotal + shippingCost + tax) * 100); // in cents

      // Create Stripe Checkout Session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: cart.items.map(item => ({
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.product_id.title,
              images: [item.product_id.images[0]]
            },
            unit_amount: Math.round(
              (item.product_id.price * (1 - (item.product_id.discount_percent || 0) / 100)) * 100
            )
          },
          quantity: item.quantity
        })),
        mode: 'payment',
        success_url: `${process.env.FRONTEND_URL}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/cart`,
        metadata: {
          userId: userId.toString(),
          addressId: addressId.toString(),
          deliveryMethod,
          couponCode: couponCode || ''
        },
        shipping_options: [
          {
            shipping_rate_data: {
              type: 'fixed_amount',
              fixed_amount: { amount: shippingCost * 100, currency: 'usd' },
              display_name: 
                deliveryMethod === 'standard' ? 'Standard Delivery (5-7 days)' :
                deliveryMethod === 'express' ? 'Express Delivery (2-3 days)' :
                'Same-Day Delivery',
              delivery_estimate: {
                minimum: { unit: 'day', value: deliveryMethod === 'same-day' ? 0 : deliveryMethod === 'express' ? 2 : 5 },
                maximum: { unit: 'day', value: deliveryMethod === 'same-day' ? 1 : deliveryMethod === 'express' ? 3 : 7 }
              }
            }
          }
        ],
        phone_number_collection: {
          enabled: true
        }
      });

      return { sessionId: session.id, sessionUrl: session.url };
    } catch (error) {
      console.error('Stripe session creation error:', error);
      throw new Error(`Payment processing failed: ${error.message}`);
    }
  }

  static async handleWebhookEvent(signature, payload) {
    try {
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
      let event;

      // Verify webhook signature
      if (webhookSecret) {
        event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
      } else {
        // In development, skip signature verification
        event = JSON.parse(payload);
      }

      switch (event.type) {
        case 'checkout.session.completed':
          await this.handleCheckoutSessionCompleted(event.data.object);
          break;
        case 'payment_intent.succeeded':
          await this.handlePaymentIntentSucceeded(event.data.object);
          break;
        case 'payment_intent.payment_failed':
          await this.handlePaymentIntentFailed(event.data.object);
          break;
        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      return { received: true };
    } catch (error) {
      console.error('Webhook error:', error);
      throw new Error(`Webhook handling failed: ${error.message}`);
    }
  }

  static async handleCheckoutSessionCompleted(session) {
    try {
      const {
        metadata: { userId, addressId, deliveryMethod, couponCode },
        payment_intent: paymentIntentId,
        amount_total: amountInCents
      } = session;

      // Fetch user and cart
      const [user, cart] = await Promise.all([
        User.findById(userId),
        Cart.findOne({ user_id: userId }).populate('items.product_id')
      ]);

      if (!user || !cart || cart.items.length === 0) {
        throw new Error('Invalid checkout session data');
      }

      // Calculate amounts
      const subtotal = cart.items.reduce((sum, item) => {
        const price = item.product_id.price * (1 - (item.product_id.discount_percent || 0) / 100);
        return sum + (price * item.quantity);
      }, 0);

      const shippingCosts = { standard: 0, express: 9.99, 'same-day': 1999 };
      const shippingCost = shippingCosts[deliveryMethod] || 0;
      const tax = subtotal * 0.1;
      const total = subtotal + shippingCost + tax;

      // Create order
      const order = new Order({
        user_id: userId,
        items: cart.items.map(item => ({
          product_id: item.product_id._id,
          quantity: item.quantity,
          price_at_purchase: item.product_id.price * (1 - (item.product_id.discount_percent || 0) / 100)
        })),
        subtotal,
        tax,
        shipping_cost: shippingCost,
        total,
        address_id: addressId,
        payment_method: 'card',
        payment_status: 'succeeded',
        order_status: 'placed',
        stripe_payment_intent_id: paymentIntentId,
        created_at: new Date()
      });

      await order.save();

      // Clear cart
      await Cart.findOneAndDelete({ user_id: userId });

      console.log(`Order created successfully: ${order._id}`);
    } catch (error) {
      console.error('Failed to process completed checkout:', error);
      throw error;
    }
  }

  static async handlePaymentIntentSucceeded(paymentIntent) {
    console.log(`PaymentIntent succeeded: ${paymentIntent.id}`);
    // Update order status if needed
  }

  static async handlePaymentIntentFailed(paymentIntent) {
    console.log(`PaymentIntent failed: ${paymentIntent.id}`);
    // Notify user about failed payment
  }
}

module.exports = StripeService;