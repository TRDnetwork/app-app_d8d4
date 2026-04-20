import { Request, Response } from 'express';
import Stripe from 'stripe';
import { Order } from '../models/Order';
import { Product } from '../models/Product';
import { User } from '../models/User';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

// Create Checkout Session
export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const { address, deliverySpeed, subtotal, couponCode, discount } = req.body;
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Calculate delivery charge based on speed
    const deliveryCharges = {
      standard: 5,
      express: 15,
      same_day: 25,
    };
    const deliveryCharge = deliveryCharges[deliverySpeed];

    // Create order in DB (pending payment)
    const order = new Order({
      user_id: userId,
      items: req.body.items, // Should be passed from cart
      address,
      delivery_speed: deliverySpeed,
      payment_method: 'stripe',
      payment_status: 'pending',
      subtotal,
      discount,
      coupon_code: couponCode,
      delivery_charge: deliveryCharge,
      total: subtotal - discount + deliveryCharge,
      status: 'placed',
    });

    await order.save();

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'ShopSphere Order',
            },
            unit_amount: Math.round(order.total * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout`,
      metadata: {
        orderId: order._id.toString(),
        userId: userId,
      },
      customer_email: user.email,
    });

    // Store session ID in order
    order.stripe_session_id = session.id;
    await order.save();

    res.json({ sessionId: session.id });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
};

// Handle Stripe Webhook
export const handleStripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig!, endpointSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.orderId;

        if (!orderId) {
          console.error('No orderId in metadata');
          break;
        }

        const order = await Order.findById(orderId);
        if (!order) {
          console.error('Order not found:', orderId);
          break;
        }

        // Prevent duplicate processing
        if (order.payment_status === 'completed') {
          console.log('Order already processed:', orderId);
          break;
        }

        // Update order with payment details
        order.payment_status = 'completed';
        order.stripe_payment_intent_id = session.payment_intent as string;
        order.status = 'confirmed';
        await order.save();

        // Update product stock
        for (const item of order.items) {
          await Product.findByIdAndUpdate(item.product_id, {
            $inc: { stock_quantity: -item.quantity },
          });
        }

        console.log('Order confirmed:', orderId);
        break;

      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('PaymentIntent was successful!', paymentIntent.id);
        break;

      case 'payment_intent.payment_failed':
        const failedIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Payment failed:', failedIntent.last_payment_error?.message);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook event:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
};