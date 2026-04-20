```ts
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

// Generate a unique correlation ID for each request
export const correlationId = (req: Request, res: Response, next: NextFunction) => {
  const id = req.headers['x-correlation-id'] || uuidv4();
  req.id = id.toString();
  res.setHeader('X-Correlation-Id', id);
  next();
};
```