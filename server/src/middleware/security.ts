import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { Request, Response, NextFunction } from 'express';

// Security middleware configuration
export const securityMiddleware = [
  // Security headers
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-eval'"], // Removed 'unsafe-inline'
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        fontSrc: ["'self'", 'https:', 'data:'],
        connectSrc: ["'self'", 'https:'],
        frameSrc: ["'self'", 'https://js.stripe.com'],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    frameguard: {
      action: 'deny',
    },
    referrerPolicy: { policy: 'no-referrer' },
  }),

  // CORS configuration - use specific origin in production
  cors({
    origin: process.env.NODE_ENV === 'production' 
      ? process.env.FRONTEND_URL 
      : '*',
    credentials: true,
  }),

  // Rate limiting for auth and payment endpoints
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
  }),
];

// Specific rate limiter for auth endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many authentication attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// Specific rate limiter for payment endpoints
export const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: 'Too many payment requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// Input sanitization middleware
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  // Sanitize request body
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        // Remove potentially dangerous characters
        req.body[key] = req.body[key].replace(/[<>]/g, '');
      }
    });
  }
  
  // Sanitize query parameters
  if (req.query) {
    Object.keys(req.query).forEach(key => {
      if (typeof req.query[key] === 'string') {
        req.query[key] = req.query[key].replace(/[<>]/g, '');
      }
    });
  }
  
  next();
};

// Path sanitization utility
export const sanitizePath = (path: string): string => {
  // Remove any directory traversal attempts
  return path.replace(/\.\.\//g, '').replace(/\/\//g, '/');
};

// Validate Stripe webhook signature
export const verifyStripeWebhook = (req: Request, res: Response, next: NextFunction) => {
  const signature = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  if (!signature || !endpointSecret) {
    return res.status(401).send('Missing signature or webhook secret');
  }
  
  try {
    // Verify the webhook signature
    const event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      endpointSecret
    );
    
    // Attach the verified event to the request
    req.stripeEvent = event;
    next();
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
};
```

```typescript