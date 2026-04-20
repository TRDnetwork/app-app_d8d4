import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { logger } from './logging';

// Error interface
interface ErrorResponse {
  success: boolean;
  message: string;
  error?: string;
  stack?: string;
}

// Error handler middleware
export const errorHandler = (
  err: Error & { statusCode?: number; code?: string },
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error
  logger.error({
    type: 'error',
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString(),
  });

  // Set status code
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  
  // Prepare error response
  const errorResponse: ErrorResponse = {
    success: false,
    message: err.message || 'Internal Server Error',
  };

  // Add error details in development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.error = err.name;
    errorResponse.stack = err.stack;
  }

  // Handle specific error types
  switch (err.code) {
    case 'ECONNREFUSED':
      errorResponse.message = 'Service unavailable. Please try again later.';
      break;
    case 'ECONNRESET':
      errorResponse.message = 'Connection reset. Please try again.';
      break;
    case 'ETIMEDOUT':
      errorResponse.message = 'Request timed out. Please try again.';
      break;
    case 'ENOENT':
      errorResponse.message = 'Resource not found.';
      break;
    default:
      // Keep the original message for other errors
      break;
  }

  // Send response
  res.status(statusCode).json(errorResponse);
};
```

```typescript
// SECURITY FIX: Use environment variables for user roles