import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { StatusCodes } from 'http-status-codes';

// Extend Express Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
      };
    }
  }
}

// Authentication middleware
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  // Get token from header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: 'Access token required',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; role: string };
    
    // Check if user exists
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Invalid token',
      });
    }

    // Add user to request object
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Token expired',
      });
    }
    
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: 'Invalid token',
    });
  }
};

// Role-based authorization middleware
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Authentication required',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: 'Insufficient permissions',
      });
    }

    next();
  };
};

// Rate limiting middleware for authentication endpoints
export const authRateLimit = (windowMs: number = 15 * 60 * 1000, max: number = 5) => {
  const limiter = new Map<string, { count: number; resetTime: number }>();
  
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
        message: 'Too many requests, please try again later',
      });
    }
    
    next();
  };
};
```

```typescript