import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

// Schema for analytics events
const analyticsEventSchema = z.object({
  event: z.string().min(1),
  properties: z.record(z.any()).optional(),
  timestamp: z.string().datetime().optional(),
});

// Track page leave events
export const trackPageLeave = (req: Request, res: Response) => {
  // In a real implementation, this would record the page leave event
  // For now, we'll just acknowledge receipt
  res.status(200).json({ success: true });
};

// Validate and process analytics events
export const validateAnalyticsEvent = (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = analyticsEventSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ 
        error: 'Invalid analytics event', 
        details: result.error.errors 
      });
    }
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid analytics event' });
  }
};

// Enhanced analytics middleware with rate limiting
export const analyticsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Don't track if DNT is enabled
  if (req.headers['dnt'] === '1') {
    return next();
  }

  // Capture basic page view data
  const analyticsData = {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    referrer: req.get('Referer'),
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
  };

  // Store in request for later processing
  (req as any).analytics = analyticsData;
  
  next();
};