import express from 'express';
import { createCheckoutSession } from '../controllers/paymentController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.post('/create-checkout-session', authMiddleware, createCheckoutSession);

export default router;