import { Router } from 'express';
import { createPaymentIntent, webhook } from '../controllers/paymentController';
import { paymentLimiter } from '../middleware/rateLimiter';

const router = Router();

// Public routes with rate limiting
router.route('/create-payment-intent')
  .post(paymentLimiter, createPaymentIntent);

// Webhook route (no rate limiting for webhooks)
router.route('/webhook')
  .post(webhook);

export default router;