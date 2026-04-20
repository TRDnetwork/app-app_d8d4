```ts
import { Request, Response, NextFunction } from 'express';
import { startTransaction, addBreadcrumb } from '../utils/monitoring';

// Performance monitoring middleware
export const performanceMonitor = (req: Request, res: Response, next: NextFunction) => {
  // Start transaction for performance monitoring
  const transaction = startTransaction(`${req.method} ${req.path}`, 'http.server');
  
  if (transaction) {
    // Set transaction on request for use in other middleware
    (req as any).sentryTransaction = transaction;
    
    // Add breadcrumb for the request
    addBreadcrumb({
      type: 'http',
      category: 'request',
      data: {
        method: req.method,
        url: req.url,
        headers: req.headers,
      },
      level: 'info',
    });
  }

  // Add response time header
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    // Add response time to transaction
    if (transaction) {
      transaction.setMeasurement('response_time', duration, 'millisecond');
      transaction.setData('response_status_code', res.statusCode);
      transaction.finish();
    }
    
    // Log slow requests
    if (duration > 500) {
      addBreadcrumb({
        type: 'performance',
        category: 'slow_request',
        data: {
          method: req.method,
          url: req.url,
          duration,
          statusCode: res.statusCode,
        },
        level: 'warning',
      });
    }
  });

  next();
};
```