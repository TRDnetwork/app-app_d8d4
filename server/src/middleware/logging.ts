import { Request, Response, NextFunction } from 'express';
import pino from 'pino';
import { v4 as uuidv4 } from 'uuid';

// Create logger with JSON formatting
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  },
});

// Create a request ID for correlation
export const correlationId = (req: Request, res: Response, next: NextFunction) => {
  const id = req.headers['x-correlation-id'] || uuidv4();
  req.id = id;
  res.setHeader('X-Correlation-Id', id);
  next();
};

// Request logging middleware
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  // Log request
  logger.info({
    type: 'request',
    id: req.id,
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString(),
  });

  // Log response when it's finished
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    // Log slow queries
    if (duration > 500) {
      logger.warn({
        type: 'slow_query',
        id: req.id,
        method: req.method,
        url: req.url,
        status: res.statusCode,
        duration,
        timestamp: new Date().toISOString(),
      });
    }
    
    logger.info({
      type: 'response',
      id: req.id,
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration,
      timestamp: new Date().toISOString(),
    });
  });

  next();
};

export default logger;
```

```typescript
// SECURITY FIX: Use environment variables for performance monitoring