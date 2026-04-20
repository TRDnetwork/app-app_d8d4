import pino from 'pino';

// Create logger with JSON formatting and appropriate level
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

// Add request ID to logs if available
export const createLogger = (req?: any) => {
  return req?.id ? logger.child({ reqId: req.id }) : logger;
};

export default logger;
```

```typescript