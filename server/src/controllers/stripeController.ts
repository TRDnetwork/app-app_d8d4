import { Request, Response } from 'express';
import Stripe from 'stripe';
import { Order } from '../models/order';
import { Cart } from '../models/cart';
import { User } from '../models/user';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

// Create Checkout Session
export const createCheckoutSession = async (req: Request, res: Response) => {
  const { userId } = req.body;
  const domain = process.env.FRONTEND_URL || 'http://localhost:5173';

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const cart = await Cart.findOne({ user_id: userId }).populate('items.product_id');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const lineItems = cart.items.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.product_id.title,
          images: [item.product_id.images[0]],
        },
        unit_amount: Math.round(item.price * 100), // in cents
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${domain}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${domain}/cart`,
      metadata: {
        user_id: userId,
        cart_id: cart._id.toString(),
      },
    });

    res.json({ id: session.id });
  } catch (err: any) {
    console.error('Error creating checkout session:', err);
    res.status(500).json({ error: err.message });
  }
};

// Handle Stripe Webhook
export const handleWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const cartId = session.metadata?.cart_id;
    const userId = session.metadata?.user_id;

    // Prevent duplicate processing
    const existingOrder = await Order.findOne({ 'payment_intent': session.payment_intent });
    if (existingOrder) {
      return res.json({ received: true });
    }

    try {
      const cart = await Cart.findById(cartId).populate('items.product_id');
      if (!cart) {
        console.error('Cart not found:', cartId);
        return res.json({ received: true });
      }

      const orderItems = cart.items.map((item: any) => ({
        product_id: item.product_id._id,
        title: item.product_id.title,
        price: item.price,
        quantity: item.quantity,
        seller_id: item.product_id.seller_id,
      }));

      const order = new Order({
        user_id: userId,
        order_number: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        items: orderItems,
        total_amount: session.amount_total ? session.amount_total / 100 : 0,
        payment_method: 'card',
        payment_status: 'completed',
        order_status: 'placed',
        address: {}, // Will be populated from user's selected address
        payment_intent: session.payment_intent,
      });

      await order.save();
      await Cart.findByIdAndDelete(cartId);

      // TODO: Send order confirmation email via Email Agent
      console.log('Order created:', order._id);
    } catch (err) {
      console.error('Error processing checkout session:', err);
      return res.status(500).json({ error: 'Failed to process order' });
    }
  }

  // Handle other events (e.g., invoice.paid for subscriptions)
  if (event.type === 'invoice.paid') {
    // Used for subscription payments
  }

  res.json({ received: true });
};