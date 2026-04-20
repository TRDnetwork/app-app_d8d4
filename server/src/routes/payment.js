const express = require('express');
const router = express.Router();
const stripeService = require('../services/stripe');
const { auth } = require('../middleware/auth');

// Create Checkout Session
router.post('/create-checkout-session', auth, async (req, res) => {
  try {
    const { successUrl, cancelUrl } = req.body;
    
    if (!successUrl || !cancelUrl) {
      return res.status(400).json({
        error: 'successUrl and cancelUrl are required'
      });
    }

    const session = await stripeService.createCheckoutSession(
      req.user.userId,
      successUrl,
      cancelUrl
    );

    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({
      error: 'Failed to create checkout session',
      message: error.message
    });
  }
});

// Stripe webhook handler
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripeService.stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    await stripeService.handleWebhook(event);
    res.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({
      error: 'Webhook processing failed'
    });
  }
});

module.exports = router;