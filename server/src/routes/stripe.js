import express from 'express';
import stripe from '../config/stripe.js';
import { authMiddleware } from '../middleware/auth.js';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Coupon from '../models/Coupon.js';
import Product from '../models/Product.js';

const router = express.Router();

// Create Checkout Session
router.post('/create-checkout-session', authMiddleware, async (req, res) => {
  try {
    const { address, deliverySpeed, couponCode } = req.body;
    const userId = req.user._id;

    // Get cart with populated products
    const cart = await Cart.findOne({ user_id: userId }).populate('items.product_id');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Validate address
    if (!address || !address.line1 || !address.city || !address.postal_code) {
      return res.status(400).json({ error: 'Valid address is required' });
    }

    // Validate delivery speed
    if (!['standard', 'express', 'same_day'].includes(deliverySpeed)) {
      return res.status(400).json({ error: 'Invalid delivery speed' });
    }

    // Calculate amounts
    let subtotal = 0;
    let discount = 0;
    const lineItems = [];

    for (const item of cart.items) {
      const product = item.product_id;
      if (!product) {
        return res.status(400).json({ error: `Product not found: ${item.product_id}` });
      }

      if (product.stock_quantity < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${product.title}` });
      }

      const price = product.price;
      const amount = price * item.quantity;
      subtotal += amount;

      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.title,
            images: [product.images[0]],
          },
          unit_amount: Math.round(price * 100),
        },
        quantity: item.quantity,
      });
    }

    // Apply coupon if provided
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode, is_active: true });
      if (coupon) {
        const now = new Date();
        if (coupon.valid_from <= now && coupon.valid_until >= now) {
          if (subtotal >= coupon.min_order_value) {
            if (coupon.type === 'percentage') {
              discount = (subtotal * coupon.value) / 100;
              if (coupon.max_discount) {
                discount = Math.min(discount, coupon.max_discount);
              }
            } else if (coupon.type === 'fixed') {
              discount = Math.min(coupon.value, subtotal);
            }
            // Increment usage
            coupon.used_count += 1;
            await coupon.save();
          }
        }
      }
    }

    // Calculate delivery charge based on speed
    const deliveryCharges = {
      standard: 0,
      express: 999, // $9.99
      same_day: 1999, // $19.99
    };
    const deliveryCharge = deliveryCharges[deliverySpeed];

    const total = Math.round((subtotal - discount + deliveryCharge) * 100);

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout`,
      metadata: {
        user_id: userId.toString(),
        address: JSON.stringify(address),
        delivery_speed: deliverySpeed,
        coupon_code: couponCode || '',
        subtotal: subtotal.toFixed(2),
        discount: discount.toFixed(2),
        delivery_charge: deliveryCharge.toFixed(2),
      },
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Create checkout session error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get session details (for order confirmation)
router.get('/session/:sessionId', authMiddleware, async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent'],
    });

    if (session.metadata.user_id !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const order = await Order.findOne({ stripe_session_id: sessionId }).populate(
      'items.product_id'
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ order });
  } catch (error) {
    console.error('Get session error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;