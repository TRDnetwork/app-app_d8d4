import { Router } from 'express';
import { trackPageLeave, validateAnalyticsEvent, analyticsMiddleware } from '../middleware/analytics';

const router = Router();

// Track page leave events (using navigator.sendBeacon)
router.post('/pageleave', trackPageLeave);

// Track custom analytics events
router.post('/event', analyticsMiddleware, validateAnalyticsEvent, (req, res) => {
  // In a production app, this would forward the event to PostHog or internal analytics service
  // For now, we'll just acknowledge receipt
  res.status(200).json({ success: true });
});

// Health check for analytics service
router.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    service: 'analytics',
    timestamp: new Date().toISOString()
  });
});

export default router;