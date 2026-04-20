import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';

// Ensure user owns the resource they're trying to access
export const ensureResourceOwnership = (model: any, idField: string = 'user_id') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const resourceId = req.params.id || req.params.productId || req.params.orderId;
      const resource = await model.findById(resourceId);
      
      if (!resource) {
        return res.status(404).json({ error: 'Resource not found' });
      }
      
      // Check if the resource belongs to the authenticated user
      if (resource[idField].toString() !== req.user.id) {
        return res.status(403).json({ error: 'Unauthorized access to resource' });
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
};

// Ensure user has required role
export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};

// Ensure user can only access their own profile
export const ensureOwnProfile = (req: Request, res: Response, next: NextFunction) => {
  if (req.params.id && req.params.id !== req.user.id) {
    return res.status(403).json({ error: 'Cannot access another user\'s profile' });
  }
  next();
};
```

```typescript
// SECURITY FIX: Update controllers to use authorization middleware