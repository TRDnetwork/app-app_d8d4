const express = require('express');
const router = express.Router();
const StripeService = require('../services/stripeService');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// Create checkout session
router.post('/create-checkout-session', authenticateToken, async (req, res) => {
  try {
    const { addressId, deliveryMethod, couponCode } = req.body;

    if (!addressId || !deliveryMethod) {
      return res.status(400).json({
        success: false,
        message: 'Address and delivery method are required'
      });
    }

    const result = await StripeService.createCheckoutSession(req.user.userId, {
      addressId,
      deliveryMethod,
      couponCode
    });

    res.json({
      success: true,
      sessionId: result.sessionId,
      sessionUrl: result.sessionUrl
    });
  } catch (error) {
    console.error('Create checkout session error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create checkout session'
    });
  }
});

// Stripe webhook handler
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const signature = req.headers['stripe-signature'];
  
  try {
    await StripeService.handleWebhookEvent(signature, req.body);
    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

module.exports = router;