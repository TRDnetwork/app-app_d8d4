import express from 'express';
import Stripe from 'stripe';
import { authenticateToken } from '../middleware/auth';
import { Order } from '../models/order';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

// Create Checkout Session
router.post('/create-checkout-session', authenticateToken, async (req, res) => {
  const {
    items,
    shippingAddress,
    deliverySpeed,
    paymentMethod,
    subtotal,
    shippingFee,
    total,
  } = req.body;

  try {
    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map((item: any) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            images: [item.image],
          },
          unit_amount: Math.round(item.price * 100), // in cents
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/api/checkout-session?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cart?payment=canceled`,
      metadata: {
        userId: req.user.id,
        deliverySpeed,
        paymentMethod,
        shippingAddress: JSON.stringify(shippingAddress),
      },
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'IN'],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 0, currency: 'usd' },
            display_name: 'Standard Shipping',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 5 },
              maximum: { unit: 'business_day', value: 7 },
            },
          },
        },
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 999, currency: 'usd' },
            display_name: 'Express Shipping',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 2 },
              maximum: { unit: 'business_day', value: 3 },
            },
          },
        },
      ],
    });

    res.json({ sessionId: session.id });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Stripe Webhook
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'] as string;
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        const metadata = session.metadata;
        
        // Create order in database
        const order = new Order({
          user_id: metadata?.userId,
          order_number: `ORD-${Date.now()}`,
          items: session.line_items?.data.map((item: any) => ({
            product_id: item.price.product,
            name: item.description,
            price: item.price.unit_amount! / 100,
            quantity: item.quantity,
            image: item.price.product_data.images[0],
          })),
          subtotal: session.amount_subtotal! / 100,
          shipping_fee: session.total_details?.amount_shipping ? session.total_details.amount_shipping / 100 : 0,
          total: session.amount_total! / 100,
          shipping_address: JSON.parse(metadata?.shippingAddress || '{}'),
          delivery_speed: metadata?.deliverySpeed,
          payment_method: metadata?.paymentMethod,
          stripe_session_id: session.id,
          status: 'placed',
          status_history: [
            { status: 'placed', timestamp: new Date() }
          ],
        });

        await order.save();
        break;

      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        // Update order status
        await Order.updateOne(
          { stripe_session_id: paymentIntent.charges.data[0].billing_details.name },
          { 
            $set: { 
              payment_status: 'completed',
              'status_history.$[status].timestamp': new Date()
            },
            $push: {
              status_history: { status: 'confirmed', timestamp: new Date() }
            }
          },
          { arrayFilters: [{ 'status.status': 'placed' }] }
        );
        break;

      case 'payment_intent.payment_failed':
        const failedIntent = event.data.object;
        // Update order status
        await Order.updateOne(
          { stripe_session_id: failedIntent.id },
          { payment_status: 'failed' }
        );
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook event:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

export default router;
```

```typescript
// SECURITY FIX: Use environment variables for OAuth credentials