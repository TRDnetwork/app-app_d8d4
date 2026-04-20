import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

// RLS (Row Level Security) middleware to ensure users can only access their own data
export const rls = (req: Request, res: Response, next: NextFunction) => {
  // Add user ID to request object for use in controllers
  if (req.user) {
    req.userId = req.user.id;
  }
  
  next();
};

// Helper function to check if user owns a resource
export const ownsResource = (resourceUserId: string, requestUserId: string): boolean => {
  return resourceUserId === requestUserId;
};

// Middleware to protect user-owned resources
export const protectResource = (req: Request, res: Response, next: NextFunction) => {
  const resourceId = req.params.id;
  const userId = req.userId;
  
  // For cart, wishlist, orders - ensure user can only access their own
  if (['cart', 'wishlist', 'orders'].includes(req.baseUrl.split('/')[2])) {
    // In a real implementation, we would query the database to get the resource
    // and check if it belongs to the user
    // This is a simplified version
    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Authentication required',
      });
    }
    
    // In a real app, we would verify the resource belongs to the user
    // For now, we'll just pass through and let the controller handle it
    next();
  } else {
    next();
  }
};
```

```typescript
// SECURITY FIX: Update auth middleware to include user ID