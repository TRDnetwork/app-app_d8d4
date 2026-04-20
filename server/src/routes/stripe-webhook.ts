import express from 'express';
import { handleStripeWebhook } from '../controllers/paymentController';
import { raw } from 'body-parser';

const router = express.Router();

// Use raw body parser for webhook
router.post('/webhook', raw({ type: 'application/json' }), handleStripeWebhook);

export default router;