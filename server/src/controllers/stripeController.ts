import { Request, Response } from 'express';
import Stripe from 'stripe';
import { Order } from '@/models/Order';
import { Cart } from '@/models/Cart';
import { User } from '@/models/User';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

// Create Checkout Session
export const createCheckoutSession = async (req: any, res: Response) => {
  try {
    const { deliverySpeed, addressId } = req.body;
    const userId = req.user.id;

    // Get user and address
    const user = await User.findById(userId).select('email name');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const address = user.addresses?.find((addr: any) => addr._id.toString() === addressId);
    if (!address) {
      return res.status(400).json({ error: 'Invalid address' });
    }

    // Get cart items
    const cart = await Cart.findOne({ userId }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Calculate total
    const deliveryFees: Record<string, number> = {
      standard: 0,
      express: 99,
      'same-day': 199,
    };
    const deliveryFee = deliveryFees[deliverySpeed] || 0;

    let total = deliveryFee;
    const lineItems = cart.items.map((item: any) => {
      const price = item.product.price;
      total += price * item.quantity;
      return {
        price_data: {
          currency: 'inr',
          product_data: {
            name: item.product.title,
            images: [item.product.images[0]],
          },
          unit_amount: Math.round(price * 100), // Stripe expects amount in paise
        },
        quantity: item.quantity,
      };
    });

    // Add delivery fee as line item if applicable
    if (deliveryFee > 0) {
      lineItems.push({
        price_data: {
          currency: 'inr',
          product_data: {
            name: `Delivery (${deliverySpeed.replace('-', ' ')})`,
          },
          unit_amount: Math.round(deliveryFee * 100),
        },
        quantity: 1,
      });
    }

    // Create order in pending status
    const order = new Order({
      userId,
      items: cart.items.map((item: any) => ({
        product: item.product._id,
        variant: item.variant,
        quantity: item.quantity,
        price: item.product.price,
        sellerId: item.product.sellerId,
      })),
      totalAmount: total,
      deliveryFee,
      deliverySpeed,
      address: {
        label: address.label,
        street: address.street,
        city: address.city,
        state: address.state,
        zip: address.zip,
        country: address.country,
      },
      paymentStatus: 'pending',
      orderStatus: 'placed',
    });

    await order.save();

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: user.email,
      success_url: `${process.env.FRONTEND_URL}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cart`,
      metadata: {
        orderId: order._id.toString(),
        userId: userId,
      },
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['IN'],
      },
    });

    res.json({ sessionId: session.id });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
};

// Handle Stripe Webhook
export const handleWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig!, endpointSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        const orderId = session.metadata?.orderId;
        
        if (orderId) {
          // Update order status
          await Order.findByIdAndUpdate(orderId, {
            paymentStatus: 'completed',
            orderStatus: 'confirmed',
            stripeSessionId: session.id,
            stripePaymentIntentId: session.payment_intent,
          });

          // Clear cart
          await Cart.findOneAndDelete({ userId: session.metadata?.userId });
        }
        break;

      case 'payment_intent.succeeded':
        // Handle successful payment
        break;

      case 'payment_intent.payment_failed':
        // Handle failed payment
        const failedPaymentIntent = event.data.object;
        const failedOrderId = failedPaymentIntent.metadata?.orderId;
        if (failedOrderId) {
          await Order.findByIdAndUpdate(failedOrderId, {
            paymentStatus: 'failed',
            orderStatus: 'cancelled',
          });
        }
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.json({ received: true });
  } catch (error: any) {
    console.error('Error processing webhook event:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
};