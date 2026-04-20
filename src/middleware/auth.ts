import { Request, Response, NextFunction } from 'express';

/**
 * Authentication middleware to protect billing routes
 */
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  // In a real implementation, this would verify a JWT token
  // For demonstration, we'll use a simple check
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  // Extract token (in real app, verify JWT)
  const token = authHeader.split(' ')[1];
  
  // For demo, assume any token is valid and set userId
  // In production, verify the token and extract userId
  (req as any).userId = 'user_123'; // This would come from the token
  
  next();
};

/**
 * Authorization middleware to check user permissions
 */
export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = (req as any).userRole || 'user'; // This would come from the token
    
    if (!roles.includes(userRole)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    next();
  };
};
```

```typescript