import { Router } from 'express';
import { createCheckoutSession, webhookHandler } from '../controllers/stripeController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/create-checkout-session', authMiddleware, createCheckoutSession);
router.post('/webhook', webhookHandler);

export default router;