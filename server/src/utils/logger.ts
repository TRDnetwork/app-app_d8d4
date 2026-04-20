```ts
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

// Add correlation ID to log messages
export const loggerWithId = (reqId: string) => {
  return logger.child({ correlationId: reqId });
};

export { logger };
```