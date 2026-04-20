const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const User = require('../models/User');

class StripeService {
  constructor() {
    this.stripe = stripe;
  }

  // Handle successful payment
  async handlePaymentSuccess(paymentIntent) {
    try {
      const { orderId, userId } = paymentIntent.metadata;

      // Update order status
      await Order.findOneAndUpdate(
        { 
          _id: orderId,
          user_id: userId
        },
        {
          payment_status: 'succeeded',
          order_status: 'confirmed'
        }
      );

      // Update seller analytics
      const order = await Order.findById(orderId).populate('items.product_id');
      if (order) {
        for (const item of order.items) {
          const sellerId = item.product_id.seller_id;
          await this.updateSellerAnalytics(sellerId, item.price_at_purchase);
        }
      }

      console.log(`Payment succeeded for order ${orderId}`);
    } catch (error) {
      console.error('Error handling successful payment:', error);
      throw error;
    }
  }

  // Handle failed payment
  async handlePaymentFailed(paymentIntent) {
    try {
      const { orderId, userId } = paymentIntent.metadata;

      // Update order status
      await Order.findOneAndUpdate(
        { 
          _id: orderId,
          user_id: userId
        },
        {
          payment_status: 'failed',
          order_status: 'cancelled'
        }
      );

      console.log(`Payment failed for order ${orderId}`);
    } catch (error) {
      console.error('Error handling failed payment:', error);
      throw error;
    }
  }

  // Update seller analytics
  async updateSellerAnalytics(sellerId, revenue) {
    try {
      const date = new Date();
      const dateKey = new Date(date.getFullYear(), date.getMonth(), date.getDate());

      const analytics = await Order.updateOne(
        {
          seller_id: sellerId,
          date: dateKey
        },
        {
          $inc: {
            revenue: revenue,
            orders_count: 1
          }
        },
        {
          upsert: true
        }
      );

      return analytics;
    } catch (error) {
      console.error('Error updating seller analytics:', error);
      throw error;
    }
  }

  // Refund a payment
  async createRefund(paymentIntentId, amount, reason = 'requested_by_customer') {
    try {
      const refund = await this.stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: amount,
        reason: reason
      });

      return refund;
    } catch (error) {
      console.error('Error creating refund:', error);
      throw error;
    }
  }
}

module.exports = new StripeService();