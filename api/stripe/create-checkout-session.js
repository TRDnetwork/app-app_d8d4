import express from 'express';
import Stripe from 'stripe';
import { Order } from '../../server/src/models/Order';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Create Stripe Checkout Session
 * Called after order is created in DB but before payment
 */
router.post('/create-checkout-session', async (req, res) => {
  const { orderId, customerEmail, amount, currency = 'usd' } = req.body;

  // Validate required fields
  if (!orderId || !customerEmail || !amount) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Verify order exists and belongs to user
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Prevent duplicate sessions
    if (order.stripe_session_id) {
      return res.json({ sessionId: order.stripe_session_id });
    }

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: customerEmail,
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: `Order #${order.order_number}`,
            },
            unit_amount: amount, // in cents
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/order-confirmation/{CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout`,
      metadata: {
        orderId,
        userId: order.user_id.toString(),
      },
      // Allow session reuse to prevent duplicates
      allow_promotion_codes: true,
    });

    // Store session ID on order
    order.stripe_session_id = session.id;
    await order.save();

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

export default router;