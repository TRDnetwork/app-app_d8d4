import express from 'express';
import Stripe from 'stripe';
import { Order } from '../../server/src/models/Order.js';
import { Product } from '../../server/src/models/Product.js';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Create Stripe Checkout Session
 * Expects orderData with: items, address, deliverySpeed, couponCode, total
 */
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { orderData } = req.body;
    
    if (!orderData || !orderData.items || !orderData.total) {
      return res.status(400).json({ 
        error: 'Invalid order data' 
      });
    }

    // Validate inventory before creating session
    for (const item of orderData.items) {
      const product = await Product.findById(item.product_id);
      if (!product || product.stock_quantity < item.quantity) {
        return res.status(400).json({ 
          error: `Product ${item.name} is out of stock` 
        });
      }
    }

    // Create a pending order in database
    const pendingOrder = new Order({
      user_id: req.user?.id, // from auth middleware
      items: orderData.items.map(item => ({
        product_id: item.product_id,
        seller_id: item.seller_id,
        variant: item.variant,
        quantity: item.quantity,
        price: item.price,
        status: 'placed'
      })),
      address: orderData.address,
      delivery_speed: orderData.deliverySpeed,
      payment_method: 'stripe',
      payment_status: 'pending',
      subtotal: orderData.subtotal,
      discount: orderData.discount || 0,
      coupon_code: orderData.couponCode,
      delivery_charge: orderData.deliveryCharge || 0,
      total: orderData.total,
      status: 'placed'
    });

    await pendingOrder.save();

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: orderData.items.map(item => ({
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
      success_url: `${process.env.FRONTEND_URL}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout`,
      metadata: {
        order_id: pendingOrder._id.toString(),
        user_id: req.user?.id
      },
      customer_email: req.user?.email,
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU', 'IN', 'DE', 'FR', 'JP']
      },
      payment_intent_data: {
        description: `Order ${pendingOrder.order_number}`,
        metadata: {
          order_id: pendingOrder._id.toString(),
          user_id: req.user?.id
        }
      }
    });

    // Return session ID to frontend
    res.status(200).json({ 
      id: session.id,
      sessionId: session.id // backward compatibility
    });

  } catch (error) {
    console.error('Stripe session creation error:', error);
    
    // Clean up: delete pending order if session creation failed
    if (error.orderId) {
      await Order.findByIdAndDelete(error.orderId);
    }

    res.status(500).json({ 
      error: 'Failed to create payment session',
      message: error.message 
    });
  }
});

export default router;