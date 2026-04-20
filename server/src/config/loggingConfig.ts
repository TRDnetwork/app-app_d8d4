// Logging configuration
export const loggingConfig = {
  level: process.env.LOG_LEVEL || 'info',
  format: process.env.LOG_FORMAT || 'json',
  enableFileLogging: process.env.ENABLE_FILE_LOGGING === 'true',
  logDirectory: process.env.LOG_DIRECTORY || './logs',
  maxFileSize: process.env.MAX_FILE_SIZE || '10m',
  maxFiles: process.env.MAX_FILES || '14d',
};
```

```typescript
// SECURITY FIX: Use environment variables for AWS configuration