import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/token';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      error: 'Access token required' 
    });
  }

  const payload = verifyAccessToken(token);
  
  if (!payload) {
    return res.status(403).json({ 
      error: 'Invalid or expired access token' 
    });
  }

  // Attach user info to request object
  req.user = {
    id: payload.userId,
    role: payload.role
  };

  next();
};

// Role-based access control middleware
export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Insufficient permissions' 
      });
    }

    next();
  };
};
```

```typescript