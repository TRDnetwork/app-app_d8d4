import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { StatusCodes } from 'http-status-codes';

// In-memory CSRF token storage (in production, use Redis or similar)
const csrfTokens = new Map<string, string>();

// CSRF protection middleware
export const csrfProtection = (req: Request, res: Response, next: NextFunction) => {
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
};

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