import express from 'express';
import { createCheckoutSession, webhookHandler } from '../controllers/stripeController';
import { authenticateJWT } from '../middleware/auth';

const router = express.Router();

router.post('/create-checkout-session', authenticateJWT, createCheckoutSession);
router.post('/webhook', express.raw({ type: 'application/json' }), webhookHandler);

export default router;