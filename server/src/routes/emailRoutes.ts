import { Router } from 'express';
import { protect, admin } from '../middleware/auth';
import { EmailService } from '../services/emailService';

const router = Router();

/**
 * POST /api/email/order-confirmation
 * Send order confirmation email
 */
router.post('/order-confirmation', protect, async (req, res) => {
  try {
    const { email, orderId, orderDate, items, total } = req.body;

    // Validate required fields
    if (!email || !orderId || !orderDate || !items || !total) {
      return res.status(400).json({
        message: 'Missing required fields: email, orderId, orderDate, items, total'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: 'Invalid email format'
      });
    }

    // Validate items array
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: 'Items must be a non-empty array'
      });
    }

    // Send email
    await EmailService.sendOrderConfirmation(
      orderId,
      email,
      orderDate,
      items,
      total
    );

    res.status(200).json({
      message: 'Order confirmation email sent successfully'
    });
  } catch (error: any) {
    console.error('Error sending order confirmation email:', error);
    res.status(500).json({
      message: 'Failed to send order confirmation email',
      error: error.message
    });
  }
});

/**
 * POST /api/email/password-reset
 * Send password reset email
 */
router.post('/password-reset', async (req, res) => {
  try {
    const { email, token } = req.body;

    // Validate required fields
    if (!email || !token) {
      return res.status(400).json({
        message: 'Missing required fields: email, token'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: 'Invalid email format'
      });
    }

    // Send email
    await EmailService.sendPasswordReset(email, token);

    res.status(200).json({
      message: 'Password reset email sent successfully'
    });
  } catch (error: any) {
    console.error('Error sending password reset email:', error);
    res.status(500).json({
      message: 'Failed to send password reset email',
      error: error.message
    });
  }
});

/**
 * POST /api/email/verify-email
 * Send email verification email
 */
router.post('/verify-email', async (req, res) => {
  try {
    const { email, token } = req.body;

    // Validate required fields
    if (!email || !token) {
      return res.status(400).json({
        message: 'Missing required fields: email, token'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: 'Invalid email format'
      });
    }

    // Send email
    await EmailService.sendEmailVerification(email, token);

    res.status(200).json({
      message: 'Email verification sent successfully'
    });
  } catch (error: any) {
    console.error('Error sending email verification:', error);
    res.status(500).json({
      message: 'Failed to send email verification',
      error: error.message
    });
  }
});

export default router;