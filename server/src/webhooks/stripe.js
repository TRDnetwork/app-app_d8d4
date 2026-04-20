import express from 'express';
import stripe from '../config/stripe.js';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

const router = express.Router();

// Stripe requires raw body for webhook signature verification
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    try {
      switch (event.type) {
        case 'checkout.session.completed':
          const session = event.data.object;

          // Prevent duplicate processing
          const existingOrder = await Order.findOne({
            stripe_session_id: session.id,
          });
          if (existingOrder) {
            console.log(`Duplicate webhook received for session ${session.id}`);
            return res.json({ received: true });
          }

          // Create order
          const order = new Order({
            user_id: session.metadata.user_id,
            order_number: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            items: JSON.parse(session.metadata.line_items).map((item) => ({
              product_id: item.product_id,
              seller_id: item.seller_id,
              quantity: item.quantity,
              price: item.price,
              status: 'placed',
            })),
            address: JSON.parse(session.metadata.address),
            delivery_speed: session.metadata.delivery_speed,
            payment_method: 'stripe',
            payment_status: 'completed',
            stripe_session_id: session.id,
            stripe_payment_intent_id: session.payment_intent,
            subtotal: parseFloat(session.metadata.subtotal),
            discount: parseFloat(session.metadata.discount),
            coupon_code: session.metadata.coupon_code || null,
            delivery_charge: parseFloat(session.metadata.delivery_charge),
            total: session.amount_total / 100,
            status: 'placed',
            estimated_delivery: new Date(
              Date.now() + getDeliveryDays(session.metadata.delivery_speed) * 24 * 60 * 60 * 1000
            ),
          });

          await order.save();

          // Update product stock
          for (const item of order.items) {
            await Product.findByIdAndUpdate(item.product_id, {
              $inc: { stock_quantity: -item.quantity },
            });
          }

          // Clear cart
          await Cart.findOneAndDelete({ user_id: session.metadata.user_id });

          console.log(`Order created: ${order._id}`);
          break;

        case 'payment_intent.succeeded':
          console.log(`Payment succeeded: ${event.data.object.id}`);
          break;

        case 'payment_intent.payment_failed':
          console.log(`Payment failed: ${event.data.object.id}`);
          // Could update order status if needed
          break;

        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      // Return 200 for all events
      res.json({ received: true });
    } catch (error) {
      console.error('Webhook processing error:', error);
      res.status(500).json({ error: error.message });
    }
  }
);

function getDeliveryDays(speed) {
  switch (speed) {
    case 'standard':
      return 5;
    case 'express':
      return 2;
    case 'same_day':
      return 0;
    default:
      return 5;
  }
}

export default router;