import express from 'express';
import Stripe from 'stripe';
import { Order } from '../../server/src/models/Order';
import { Cart } from '../../server/src/models/Cart';
import { User } from '../../server/src/models/User';
import { Coupon } from '../../server/src/models/Coupon';
import { verifyToken } from '../../server/src/middleware/auth';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

/**
 * POST /api/stripe/create-checkout-session
 * Creates a Stripe Checkout Session for the current cart
 */
router.post('/create-checkout-session', verifyToken, async (req, res) => {
  const { addressId, deliverySpeed, couponCode } = req.body;
  const userId = req.user._id;

  try {
    // Get user and address
    const user = await User.findById(userId).select('email name addresses');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(400).json({ error: 'Invalid address' });
    }

    // Get cart
    const cart = await Cart.findOne({ user_id: userId }).populate('items.product_id');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Calculate totals
    let subtotal = 0;
    const lineItems = [];

    for (const item of cart.items) {
      const price = item.price_snapshot;
      const amount = price * item.quantity;
      subtotal += amount;

      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.title,
            images: [item.image],
          },
          unit_amount: Math.round(price * 100), // in cents
        },
        quantity: item.quantity,
      });
    }

    // Apply coupon if valid
    let discountAmount = 0;
    let coupon = null;

    if (couponCode) {
      coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), active: true });
      if (coupon && new Date() >= coupon.valid_from && new Date() <= coupon.valid_until) {
        if (subtotal >= coupon.min_order_value) {
          if (coupon.used_count < coupon.max_uses) {
            discountAmount =
              coupon.discount_type === 'percent'
                ? (subtotal * coupon.discount_value) / 100
                : coupon.discount_value;
            discountAmount = Math.min(discountAmount, subtotal); // Don't exceed subtotal

            // Increment usage
            coupon.used_count += 1;
            await coupon.save();
          }
        }
      }
    }

    // Delivery fees
    const deliveryFees = {
      standard: 599, // in cents
      express: 1299,
    };
    const deliveryFee = deliveryFees[deliverySpeed] || deliveryFees.standard;

    // Calculate total
    const total = Math.round((subtotal - discountAmount + deliveryFee) * 100); // in cents

    if (total <= 0) {
      return res.status(400).json({ error: 'Invalid total amount' });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: lineItems,
      success_url: `${process.env.FRONTEND_URL}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cart`,
      metadata: {
        userId: userId.toString(),
        addressId,
        deliverySpeed,
        couponCode: coupon?.code || '',
        discountAmount: discountAmount.toFixed(2),
      },
      discounts: discountAmount > 0 ? [{ coupon: 'promo_12345' }] : [], // Stripe coupon not used; we handle discount manually
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: deliveryFee, currency: 'usd' },
            display_name: deliverySpeed === 'express' ? 'Express Shipping' : 'Standard Shipping',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: deliverySpeed === 'express' ? 1 : 3 },
              maximum: { unit: 'business_day', value: deliverySpeed === 'express' ? 2 : 5 },
            },
          },
        },
      ],
      customer_email: user.email,
      phone_number_collection: {
        enabled: true,
      },
    });

    // Store session in temporary order (pending)
    const order = new Order({
      user_id: userId,
      order_number: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      items: cart.items.map((item) => ({
        product_id: item.product_id._id,
        variant: item.variant_id,
        quantity: item.quantity,
        price: item.price_snapshot,
        seller_id: item.product_id.seller_id,
      })),
      total_amount: total / 100,
      discount_amount: discountAmount,
      delivery_fee: deliveryFee / 100,
      payment_method: 'card',
      payment_status: 'pending',
      order_status: 'placed',
      address: {
        label: address.label,
        street: address.street,
        city: address.city,
        state: address.state,
        zip: address.zip,
        country: address.country,
      },
      delivery_speed: deliverySpeed,
      coupon_code: coupon?.code,
      stripe_session_id: session.id,
    });

    await order.save();

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

export default router;