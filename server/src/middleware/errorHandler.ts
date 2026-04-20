```ts
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
});

interface ErrorWithStatus extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: ErrorWithStatus,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error with correlation ID
  logger.error({
    correlationId: req.id,
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    message: 'Unhandled error'
  });

  // Set default status code
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;

  // Send response
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
```