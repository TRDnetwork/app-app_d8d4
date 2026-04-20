const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

// Create Checkout Session
router.post('/create-checkout-session', async (req, res) => {
  const { items, customerDetails, shippingCost = 0 } = req.body;

  try {
    // Validate required fields
    if (!customerDetails || !customerDetails.email) {
      return res.status(400).json({ error: 'Customer email is required' });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: items.map((item) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Product ${item.id}`,
          },
          unit_amount: 1000, // $10.00 in cents - this should come from your product DB
        },
        quantity: item.quantity,
      })),
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: Math.round(shippingCost * 100),
              currency: 'usd',
            },
            display_name: 'Shipping',
          },
        },
      ],
      customer_email: customerDetails.email,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU', 'IN'],
      },
      metadata: {
        address: JSON.stringify(customerDetails.address),
        name: customerDetails.name,
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
    });

    res.status(200).json({ clientSecret: session.client_secret });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({
      error: 'Failed to create checkout session',
      message: error.message,
    });
  }
});

module.exports = router;