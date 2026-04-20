import express from 'express';
import Stripe from 'stripe';
import { Order } from '../../server/src/models/Order';
import { sendOrderConfirmationEmail } from '../../server/src/services/emailService';
import { verifyToken } from '../../server/src/middleware/auth';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

// Stripe requires raw body for webhook signature verification
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  async (request, response) => {
    const sig = request.headers['stripe-signature'];
    let event;

    // Verify webhook signature
    try {
      event = stripe.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return response.status(400).send(`Webhook Error: ${err.message}`);
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
          const failedPaymentIntent = event.data.object;
          await handlePaymentFailed(failedPaymentIntent);
          break;

        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      // Return a 200 response to acknowledge receipt of the event
      response.json({ received: true });
    } catch (error) {
      console.error('Error processing webhook event:', error);
      response.status(500).json({ error: 'Webhook processing failed' });
    }
  }
);

/**
 * Handle successful checkout session
 */
async function handleCheckoutSessionCompleted(session) {
  const orderId = await Order.findOne({ stripe_session_id: session.id }).then((order) => order?._id);

  if (!orderId) {
    console.error('Order not found for session:', session.id);
    return;
  }

  // Update order status
  await Order.findByIdAndUpdate(
    orderId,
    {
      payment_status: 'completed',
      order_status: 'confirmed',
      $set: {
        'payment_details.stripe_payment_intent_id': session.payment_intent,
        'payment_details.payment_method': session.payment_method_types[0],
        'payment_details.card_last4': session.customer_details?.address?.postal_code || 'N/A',
      },
    },
    { new: true }
  );

  // Send order confirmation email
  try {
    await sendOrderConfirmationEmail(orderId);
  } catch (error) {
    console.error('Failed to send order confirmation email:', error);
    // Don't throw - order is still valid
  }
}

/**
 * Handle successful payment intent
 */
async function handlePaymentIntentSucceeded(paymentIntent) {
  // Usually redundant with checkout.session.completed, but good to have
  const order = await Order.findOne({ 'payment_details.stripe_payment_intent_id': paymentIntent.id });
  if (order && order.payment_status !== 'completed') {
    order.payment_status = 'completed';
    order.order_status = 'confirmed';
    await order.save();

    try {
      await sendOrderConfirmationEmail(order._id);
    } catch (error) {
      console.error('Failed to send order confirmation email:', error);
    }
  }
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(paymentIntent) {
  const order = await Order.findOne({ 'payment_details.stripe_payment_intent_id': paymentIntent.id });
  if (order) {
    order.payment_status = 'failed';
    order.order_status = 'failed';
    order.failure_reason = paymentIntent.last_payment_error?.message || 'Payment failed';
    await order.save();
  }
}

export default router;