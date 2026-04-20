import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

// In-memory rate limiter (in production, use Redis or similar)
const limiter = new Map<string, { count: number; resetTime: number }>();

interface RateLimitOptions {
  windowMs: number;
  max: number;
  message?: string;
}

export const rateLimit = (options: RateLimitOptions) => {
  const { windowMs = 15 * 60 * 1000, max = 100, message = 'Too many requests, please try again later' } = options;
  
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip;
    const now = Date.now();
    
    if (!limiter.has(ip)) {
      limiter.set(ip, { count: 1, resetTime: now + windowMs });
    } else {
      const record = limiter.get(ip)!;
      
      if (now > record.resetTime) {
        // Reset counter if window has passed
        record.count = 1;
        record.resetTime = now + windowMs;
      } else {
        record.count++;
      }
    }
    
    const record = limiter.get(ip)!;
    
    if (record.count > max) {
      return res.status(StatusCodes.TOO_MANY_REQUESTS).json({
        success: false,
        message,
      });
    }
    
    next();
  };
};

// Specific rate limiters for different endpoints
export const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
});

export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many authentication attempts, please try again later',
});
```

```typescript