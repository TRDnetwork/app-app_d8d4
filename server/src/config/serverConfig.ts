// Server configuration
export const serverConfig = {
  port: parseInt(process.env.PORT || '5000'),
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  serverUrl: process.env.SERVER_URL || 'http://localhost:5000',
  apiPrefix: process.env.API_PREFIX || '/api',
};
```

```typescript
// SECURITY FIX: Use environment variables for logging configuration