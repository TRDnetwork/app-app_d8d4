import { buffer } from 'micro';
import { stripe } from '../../server/src/services/stripe';
import { db } from '../../server/src/services/database';

// Disable body parsing for raw buffer
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(buf.toString(), sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;

        // Prevent replay attacks by checking if session was already processed
        const existingOrder = await db.collection('app_d8d4_orders').findOne({
          stripe_session_id: session.id,
        });

        if (existingOrder) {
          return res.status(200).json({ received: true });
        }

        // Retrieve session metadata
        const {
          userId,
          address,
          deliverySpeed,
          couponCode,
          discountAmount,
        } = session.metadata;

        // Retrieve line items
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
          limit: 100,
        });

        // Create order in database
        const order = {
          user_id: db.ObjectId(userId),
          order_number: `ORD-${Date.now()}`,
          items: lineItems.data.map(item => ({
            product_id: db.ObjectId(item.price.product),
            quantity: item.quantity,
            price: item.price.unit_amount / 100,
            status: 'placed',
          })),
          address: JSON.parse(address),
          delivery_speed: deliverySpeed,
          payment_method: 'stripe',
          payment_status: 'completed',
          stripe_session_id: session.id,
          stripe_payment_intent_id: session.payment_intent,
          subtotal: session.amount_subtotal / 100,
          discount: parseFloat(discountAmount) / 100,
          delivery_charge: session.shipping_cost ? session.shipping_cost.amount_total / 100 : 0,
          total: session.amount_total / 100,
          status: 'placed',
          created_at: new Date(),
          updated_at: new Date(),
        };

        const result = await db.collection('app_d8d4_orders').insertOne(order);

        // Update coupon usage if applicable
        if (couponCode) {
          await db.collection('app_d8d4_coupons').updateOne(
            { code: couponCode },
            { $inc: { used_count: 1 } }
          );
        }

        // Update inventory
        for (const item of order.items) {
          await db.collection('app_d8d4_products').updateOne(
            { _id: item.product_id },
            { $inc: { stock_quantity: -item.quantity } }
          );
        }

        // Clean up checkout session
        await db.collection('app_d8d4_checkout_sessions').deleteOne({
          sessionId: session.id,
        });

        break;

      case 'payment_intent.succeeded':
        // Handle successful payment (could be direct, not through checkout)
        const paymentIntent = event.data.object;
        console.log('Payment succeeded:', paymentIntent.id);
        break;

      case 'payment_intent.payment_failed':
        // Handle failed payment
        const failedPaymentIntent = event.data.object;
        console.log('Payment failed:', failedPaymentIntent.id, failedPaymentIntent.last_payment_error?.message);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return 200 for all events to acknowledge receipt
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}