```ts
import { Request, Response, NextFunction } from 'express';
import pino from 'pino';

// Create logger instance
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

// Request logging middleware
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  // Log request
  logger.info({
    correlationId: req.id,
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    message: 'Incoming request'
  });

  // Log response
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({
      correlationId: req.id,
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      durationMs: duration,
      message: 'Request completed'
    });

    // Log slow requests (>500ms)
    if (duration > 500) {
      logger.warn({
        correlationId: req.id,
        method: req.method,
        url: req.url,
        durationMs: duration,
        message: 'Slow request detected'
      });
    }
  });

  next();
};
```