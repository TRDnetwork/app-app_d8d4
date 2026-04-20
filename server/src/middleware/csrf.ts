import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { StatusCodes } from 'http-status-codes';
import rateLimit from 'express-rate-limit';

// In-memory CSRF token storage (in production, use Redis or similar)
const csrfTokens = new Map<string, string>();

// Rate limit for CSRF token generation - SECURITY FIX: Add rate limiting
const csrfLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many CSRF token requests, please try again later'
});

// CSRF protection middleware
export const csrfProtection = [
  csrfLimiter,
  (req: Request, res: Response, next: NextFunction) => {
    // Generate CSRF token for GET requests
    if (req.method === 'GET') {
      const csrfToken = crypto.randomBytes(32).toString('hex');
      csrfTokens.set(req.ip, csrfToken);
      
      // Set CSRF token in response header
      res.setHeader('X-CSRF-Token', csrfToken);
    }
    
    // Verify CSRF token for state-changing requests
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
      const csrfToken = req.headers['x-csrf-token'] as string;
      
      if (!csrfToken || !csrfTokens.has(req.ip) || csrfTokens.get(req.ip) !== csrfToken) {
        return res.status(StatusCodes.FORBIDDEN).json({
          success: false,
          message: 'Invalid CSRF token',
        });
      }
      
      // Remove token after use (one-time use)
      csrfTokens.delete(req.ip);
    }
    
    next();
  }
];

// CSRF token validation middleware
export const validateCsrfToken = (req: Request, res: Response, next: NextFunction) => {
  const csrfToken = req.headers['x-csrf-token'] as string;
  
  if (!csrfToken || !csrfTokens.has(req.ip) || csrfTokens.get(req.ip) !== csrfToken) {
    return res.status(StatusCodes.FORBIDDEN).json({
      success: false,
      message: 'Invalid CSRF token',
    });
  }
  
  // Remove token after use (one-time use)
  csrfTokens.delete(req.ip);
  
  next();
};
```

```typescript