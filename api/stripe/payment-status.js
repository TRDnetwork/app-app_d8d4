import express from 'express';
import { Order } from '../../server/src/models/Order';
import { verifyToken } from '../../server/src/middleware/auth';

const router = express.Router();

/**
 * GET /api/stripe/payment-status/:sessionId
 * Check the status of a Stripe payment session
 */
router.get('/payment-status/:sessionId', verifyToken, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user._id;

    const order = await Order.findOne({ stripe_session_id: sessionId, user_id: userId });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({
      status: order.payment_status,
      orderStatus: order.order_status,
      orderId: order._id,
      orderNumber: order.order_number,
    });
  } catch (error) {
    console.error('Error checking payment status:', error);
    res.status(500).json({ error: 'Failed to check payment status' });
  }
});

export default router;