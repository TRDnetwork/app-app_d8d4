import express from 'express';
import { createCheckoutSession, webhookHandler } from '../controllers/stripeController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Create Stripe Checkout Session
router.post('/create-checkout-session', authMiddleware, createCheckoutSession);

// Stripe Webhook Handler
router.post('/webhook', express.raw({ type: 'application/json' }), webhookHandler);

export default router;