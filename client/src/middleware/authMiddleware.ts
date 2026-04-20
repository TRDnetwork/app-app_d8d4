import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { config } from '../config/env';

// JWT verification middleware
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  // Get token from Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({
      success: false,
      statusCode: 401,
      message: 'Access token required',
      timestamp: new Date().toISOString()
    });
  }
  
  // Verify token
  jwt.verify(token, config.JWT_SECRET, async (err, decoded: any) => {
    if (err) {
      return res.status(403).json({
        success: false,
        statusCode: 403,
        message: 'Invalid or expired token',
        timestamp: new Date().toISOString()
      });
    }
    
    try {
      // Find user
      const user = await User.findById(decoded.id).select('-password_hash');
      
      if (!user) {
        return res.status(404).json({
          success: false,
          statusCode: 404,
          message: 'User not found',
          timestamp: new Date().toISOString()
        });
      }
      
      // Attach user to request
      req.user = user;
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: 'Internal server error',
        timestamp: new Date().toISOString()
      });
    }
  });
};

// Role-based access control middleware
export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: 'Authentication required',
        timestamp: new Date().toISOString()
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        statusCode: 403,
        message: 'Insufficient permissions',
        timestamp: new Date().toISOString()
      });
    }
    
    next();
  };
};

// Admin-only middleware
export const requireAdmin = requireRole(['admin']);

// Seller-only middleware
export const requireSeller = requireRole(['seller', 'admin']);

// Customer-only middleware
export const requireCustomer = requireRole(['customer', 'seller', 'admin']);
```

```typescript