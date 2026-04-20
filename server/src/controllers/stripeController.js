import Stripe from 'stripe';
import { Order } from '../models/Order.js';
import { Cart } from '../models/Cart.js';
import { Coupon } from '../models/Coupon.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Create Stripe Checkout Session
 */
export const createCheckoutSession = async (req, res) => {
  try {
    const { items, address, deliverySpeed, couponCode } = req.body;
    const userId = req.user._id;

    // Validate cart items
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Get user's cart to ensure data consistency
    const cart = await Cart.findOne({ user_id: userId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart not found or empty' });
    }

    // Calculate totals
    let subtotal = 0;
    let discount = 0;

    cart.items.forEach(item => {
      const cartItem = items.find(i => i.product_id === item.product_id);
      if (cartItem) {
        subtotal += cartItem.price * cartItem.quantity;
      }
    });

    // Apply coupon if provided
    if (couponCode) {
      const coupon = await Coupon.findOne({ 
        code: couponCode, 
        is_active: true,
        valid_from: { $lte: new Date() },
        valid_until: { $gte: new Date() }
      });

      if (coupon) {
        if (subtotal >= coupon.min_order_value) {
          if (coupon.type === 'percentage') {
            discount = Math.min(subtotal * (coupon.value / 100), coupon.max_discount || subtotal);
          } else {
            discount = Math.min(coupon.value, subtotal);
          }
        }
      }
    }

    const deliveryCharge = deliverySpeed === 'express' ? 9.99 : 
                          deliverySpeed === 'same_day' ? 19.99 : 0;

    const total = Math.max(0, subtotal - discount + deliveryCharge);

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name || `Product ${item.product_id}`,
            images: [item.image || 'https://via.placeholder.com/300'],
          },
          unit_amount: Math.round(item.price * 100), // in cents
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout`,
      metadata: {
        user_id: userId.toString(),
        address_id: address._id,
        delivery_speed: deliverySpeed,
        coupon_code: couponCode || '',
        subtotal: subtotal.toFixed(2),
        discount: discount.toFixed(2),
        delivery_charge: deliveryCharge.toFixed(2),
        total: total.toFixed(2)
      },
      customer_email: req.user.email,
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU', 'IN'] // Add more as needed
      }
    });

    // Store session ID in temporary order record (pending)
    const order = new Order({
      user_id: userId,
      items: items.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
        status: 'placed'
      })),
      address: {
        type: address.type,
        line1: address.line1,
        line2: address.line2,
        city: address.city,
        state: address.state,
        postal_code: address.postal_code,
        country: address.country
      },
      delivery_speed: deliverySpeed,
      payment_method: 'stripe',
      payment_status: 'pending',
      stripe_session_id: session.id,
      subtotal,
      discount,
      delivery_charge: deliveryCharge,
      total,
      status: 'placed',
      coupon_code: couponCode
    });

    await order.save();

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Create checkout session error:', error);
    res.status(500).json({ 
      error: 'Failed to create checkout session',
      message: error.message 
    });
  }
};

/**
 * Handle Stripe Webhook Events
 */
export const webhookHandler = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        
        // Prevent duplicate processing
        const existingOrder = await Order.findOne({ stripe_session_id: session.id });
        if (!existingOrder) {
          console.warn('Order not found for session:', session.id);
          break;
        }

        if (existingOrder.payment_status === 'completed') {
          console.log('Order already processed:', existingOrder._id);
          break;
        }

        // Update order with payment details
        existingOrder.payment_status = 'completed';
        existingOrder.stripe_payment_intent_id = session.payment_intent;
        existingOrder.status = 'confirmed';
        existingOrder.updated_at = new Date();

        await existingOrder.save();

        // Clear user's cart
        await Cart.findOneAndDelete({ user_id: existingOrder.user_id });

        console.log('Order confirmed:', existingOrder._id);
        break;

      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('Payment succeeded:', paymentIntent.id);
        break;

      case 'payment_intent.payment_failed':
        const failedIntent = event.data.object;
        console.log('Payment failed:', failedIntent.id, failedIntent.last_payment_error?.message);
        
        // Update order status
        await Order.findOneAndUpdate(
          { stripe_payment_intent_id: failedIntent.id },
          { 
            payment_status: 'failed',
            status: 'cancelled',
            updated_at: new Date()
          }
        );
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return 200 to acknowledge receipt
    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
};