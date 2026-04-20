import express from 'express';
import stripe from 'stripe';
import { authMiddleware } from '../middleware/auth';
import { OrderModel } from '../models/Order';

const router = express.Router();
const client = new stripe(import.meta.env.STRIPE_SECRET_KEY);

router.post(
  '/create-checkout-session',
  authMiddleware,
  async (req, res) => {
    try {
      const { address, deliverySpeed, paymentMethod } = req.body;
      const user = req.user;

      // Get user's cart - in a real app this would come from the database
      // This is simplified for the example
      const cartItems = [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Wireless Earbuds Pro',
              images: ['https://via.placeholder.com/300'],
            },
            unit_amount: 12999, // $129.99
          },
          quantity: 1,
        },
      ];

      const deliveryCharges = {
        standard: 0,
        express: 999, // $9.99
        same_day: 1999, // $19.99
      };

      // Create order in database with pending status
      const orderNumber = `ORD-${Date.now()}-${user._id.slice(-4)}`;
      const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price_data.unit_amount * item.quantity,
        0
      );
      const deliveryCharge = deliveryCharges[deliverySpeed as keyof typeof deliveryCharges];
      const total = subtotal + deliveryCharge;

      const order = new OrderModel({
        user_id: user._id,
        order_number: orderNumber,
        items: cartItems.map((item) => ({
          product_id: 'mock_product_id',
          variant: '',
          quantity: item.quantity,
          price: item.price_data.unit_amount / 100,
          status: 'placed',
        })),
        address,
        delivery_speed: deliverySpeed,
        payment_method: paymentMethod,
        payment_status: 'pending',
        subtotal: subtotal / 100,
        delivery_charge: deliveryCharge / 100,
        total: total / 100,
        status: 'placed',
        created_at: new Date(),
      });

      await order.save();

      // Create Stripe Checkout Session
      const session = await client.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: cartItems,
        mode: 'payment',
        success_url: `${process.env.FRONTEND_URL}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/checkout`,
        client_reference_id: orderNumber,
        metadata: {
          user_id: user._id,
          order_number: orderNumber,
          delivery_speed: deliverySpeed,
        },
      });

      res.json({ id: session.id });
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      res.status(500).json({ error: error.message });
    }
  }
);

router.get('/session/:sessionId', async (req, res) => {
  try {
    const session = await client.checkout.sessions.retrieve(req.params.sessionId);
    res.json(session);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;