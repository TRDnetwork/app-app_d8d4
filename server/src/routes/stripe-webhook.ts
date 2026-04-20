import express from 'express';
import stripe from 'stripe';
import { buffer } from 'node:stream/consumers';
import { OrderModel } from '../models/Order';
import { ProductModel } from '../models/Product';

const router = express.Router();
const client = new stripe(import.meta.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

// Stripe requires raw body for webhook signature verification
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const body = await buffer(req);

    let event;

    try {
      event = client.webhooks.constructEvent(
        body,
        sig!,
        import.meta.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object;
          
          // Prevent duplicate processing
          const existingOrder = await OrderModel.findOne({
            stripe_session_id: session.id,
          });
          
          if (existingOrder) {
            console.log(`Duplicate webhook received for session ${session.id}`);
            return res.json({ received: true });
          }

          // Update order status
          await OrderModel.findOneAndUpdate(
            { order_number: session.client_reference_id },
            {
              payment_status: 'completed',
              stripe_payment_intent_id: session.payment_intent as string,
              updated_at: new Date(),
            }
          );

          // Update inventory
          const order = await OrderModel.findOne({
            order_number: session.client_reference_id,
          }).populate('items.product_id');

          if (order) {
            for (const item of order.items) {
              await ProductModel.findByIdAndUpdate(item.product_id._id, {
                $inc: { stock_quantity: -item.quantity },
              });
            }
          }

          break;
        }

        case 'payment_intent.payment_failed': {
          const paymentIntent = event.data.object;
          await OrderModel.findOneAndUpdate(
            { stripe_payment_intent_id: paymentIntent.id },
            {
              payment_status: 'failed',
              updated_at: new Date(),
            }
          );
          break;
        }

        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      res.json({ received: true });
    } catch (error) {
      console.error('Error processing webhook:', error);
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  }
);

export default router;