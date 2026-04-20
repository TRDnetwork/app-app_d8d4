import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/token';
import { User } from '../models/User';

/**
 * Authenticate token middleware
 * Verify JWT access token and attach user to request
 */
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token is required'
    });
  }

  const decoded = verifyAccessToken(token);
  
  if (!decoded) {
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired access token'
    });
  }

  // Attach user to request
  req.user = decoded;
  next();
};

/**
 * Role-based access control middleware
 * Check if user has required role
 */
export const requireRole = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Check if user role is in allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

/**
 * Protect route middleware
 * Combine authentication and role checking
 */
export const protect = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await authenticateToken(req, res, () => {
      if (roles.length === 0) {
        next();
      } else {
        requireRole(roles)(req, res, next);
      }
    });
  };
};
```

```typescript