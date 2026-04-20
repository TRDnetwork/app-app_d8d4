import express from 'express';
import Stripe from 'stripe';
import { Order } from '../../server/src/models/Order';
import { sendOrderConfirmationEmail } from '../../server/src/services/emailService';

const router = express.Router();

// Stripe requires raw body for webhook signature verification
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  // Verify webhook signature
  try {
    event = Stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        await handleCheckoutSessionCompleted(session);
        break;

      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        await handlePaymentIntentSucceeded(paymentIntent);
        break;

      case 'payment_intent.payment_failed':
        const failedIntent = event.data.object;
        await handlePaymentFailed(failedIntent);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return 200 to acknowledge receipt
    res.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    // Return 500 to trigger retry
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

/**
 * Handle successful checkout session
 */
async function handleCheckoutSessionCompleted(session) {
  const { orderId, userId } = session.metadata;

  // Find order
  const order = await Order.findById(orderId);
  if (!order) {
    throw new Error(`Order ${orderId} not found`);
  }

  // Update order status
  order.payment_status = 'completed';
  order.stripe_payment_intent_id = session.payment_intent;
  order.status = 'confirmed'; // Move to confirmed after payment
  order.paid_at = new Date();

  await order.save();

  // Send order confirmation email
  await sendOrderConfirmationEmail(order, userId);
}

/**
 * Handle successful payment intent
 */
async function handlePaymentIntentSucceeded(paymentIntent) {
  // Update order if needed
  const order = await Order.findOne({ stripe_payment_intent_id: paymentIntent.id });
  if (order && order.payment_status !== 'completed') {
    order.payment_status = 'completed';
    order.status = 'confirmed';
    order.paid_at = new Date();
    await order.save();
  }
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(paymentIntent) {
  const order = await Order.findOne({ stripe_payment_intent_id: paymentIntent.id });
  if (order) {
    order.payment_status = 'failed';
    order.status = 'cancelled';
    await order.save();
  }
}

export default router;