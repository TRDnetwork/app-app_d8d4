import express from 'express';
import Stripe from 'stripe';
import { Order } from '../../server/src/models/Order.js';
import { Product } from '../../server/src/models/Product.js';
import { sendOrderConfirmationEmail } from '../../server/src/services/emailService.js';

const router = express.Router();

// Stripe requires raw body for webhook signature verification
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = Stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        
        // Prevent duplicate processing
        const existingOrder = await Order.findOne({ 
          stripe_session_id: session.id 
        });
        
        if (existingOrder) {
          console.log('Duplicate webhook received for session:', session.id);
          return res.status(200).send('Webhook received');
        }

        // Update order with payment success
        const order = await Order.findOneAndUpdate(
          { _id: session.metadata.order_id },
          {
            stripe_session_id: session.id,
            stripe_payment_intent_id: session.payment_intent,
            payment_status: 'completed',
            status: 'confirmed',
            updated_at: new Date()
          },
          { new: true }
        );

        if (order) {
          // Update inventory
          for (const item of order.items) {
            await Product.findByIdAndUpdate(
              item.product_id,
              { $inc: { stock_quantity: -item.quantity } },
              { new: true }
            );
          }

          // Send confirmation email
          await sendOrderConfirmationEmail(
            order.user_id,
            order._id,
            order.total
          );
        }
        break;

      case 'payment_intent.payment_failed':
        const failedIntent = event.data.object;
        
        await Order.findOneAndUpdate(
          { 'metadata.payment_intent': failedIntent.id },
          {
            payment_status: 'failed',
            status: 'cancelled',
            updated_at: new Date()
          }
        );
        break;

      case 'payment_intent.succeeded':
        const succeededIntent = event.data.object;
        
        await Order.findOneAndUpdate(
          { stripe_payment_intent_id: succeededIntent.id },
          {
            payment_status: 'completed',
            status: 'confirmed',
            updated_at: new Date()
          }
        );
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Always return 200 to acknowledge receipt
    res.status(200).send('Webhook received');
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).send('Webhook processing failed');
  }
});

export default router;