import { Request, Response } from 'express';
import Stripe from 'stripe';
import { Order } from '../models/Order';
import { Cart } from '../models/Cart';
import { apiResponse } from '../utils/apiResponse';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export const createCheckoutSession = async (req: any, res: Response) => {
  try {
    const { address, deliverySpeed } = req.body;
    const userId = req.user.id;

    // Get cart items
    const cart = await Cart.findOne({ user_id: userId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json(apiResponse(400, 'Cart is empty'));
    }

    // Calculate delivery charge
    const deliveryOptions: Record<string, number> = {
      standard: 0,
      express: 999, // in cents
      same_day: 1999,
    };
    const deliveryCharge = deliveryOptions[deliverySpeed] || 0;

    // Calculate total
    const subtotal = cart.items.reduce((sum, item) => sum + item.price_snapshot * item.quantity, 0);
    const total = subtotal + deliveryCharge;

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout`,
      metadata: {
        user_id: userId,
        address_id: address.id,
        delivery_speed: deliverySpeed,
      },
      line_items: cart.items.map((item: any) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.product_title,
            images: [item.product_image],
          },
          unit_amount: Math.round(item.price_snapshot * 100),
        },
        quantity: item.quantity,
      })),
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: deliveryCharge, currency: 'usd' },
            display_name: deliverySpeed === 'standard' ? 'Standard Delivery' : deliverySpeed === 'express' ? 'Express Delivery' : 'Same Day Delivery',
            delivery_estimate: {
              minimum: { unit: 'day', value: deliverySpeed === 'standard' ? 5 : deliverySpeed === 'express' ? 2 : 0 },
              maximum: { unit: 'day', value: deliverySpeed === 'standard' ? 7 : deliverySpeed === 'express' ? 3 : 0 },
            },
          },
        },
      ],
    });

    res.json(apiResponse(200, 'Checkout session created', { sessionId: session.id }));
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    res.status(500).json(apiResponse(500, error.message));
  }
};

export const webhookHandler = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      await handleCheckoutSessionCompleted(session);
      break;
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('PaymentIntent was successful!', paymentIntent);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};

const handleCheckoutSessionCompleted = async (session: any) => {
  const userId = session.metadata.user_id;
  const addressId = session.metadata.address_id;
  const deliverySpeed = session.metadata.delivery_speed;

  // Get user address
  const user = await User.findById(userId).select('addresses');
  const address = user?.addresses?.find((addr: any) => addr._id.toString() === addressId);

  if (!address) {
    throw new Error('Address not found');
  }

  // Get cart
  const cart = await Cart.findOne({ user_id: userId });
  if (!cart || cart.items.length === 0) {
    throw new Error('Cart is empty');
  }

  // Create order
  const order = new Order({
    user_id: userId,
    order_number: `ORD-${Date.now().toString().slice(-6).toUpperCase()}`,
    items: cart.items.map((item: any) => ({
      product_id: item.product_id,
      seller_id: item.seller_id,
      variant: item.variant_id,
      quantity: item.quantity,
      price: item.price_snapshot,
      status: 'placed',
    })),
    address: {
      line1: address.line1,
      line2: address.line2,
      city: address.city,
      state: address.state,
      postal_code: address.postal_code,
      country: address.country,
    },
    delivery_speed: deliverySpeed,
    payment_method: 'stripe',
    payment_status: 'completed',
    stripe_session_id: session.id,
    stripe_payment_intent_id: session.payment_intent,
    subtotal: session.amount_subtotal / 100,
    delivery_charge: session.shipping_cost?.amount_total / 100 || 0,
    total: session.amount_total / 100,
    status: 'placed',
    estimated_delivery: calculateEstimatedDelivery(deliverySpeed),
  });

  await order.save();

  // Clear cart
  await Cart.findOneAndDelete({ user_id: userId });
};

const calculateEstimatedDelivery = (speed: string) => {
  const now = new Date();
  switch (speed) {
    case 'standard':
      now.setDate(now.getDate() + 7);
      return now;
    case 'express':
      now.setDate(now.getDate() + 3);
      return now;
    case 'same_day':
      return now;
    default:
      now.setDate(now.getDate() + 7);
      return now;
  }
};