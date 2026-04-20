import cors from 'cors';

// CORS configuration
export const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      callback(null, true);
      return;
    }
    
    // In development, allow localhost from any port
    if (process.env.NODE_ENV === 'development') {
      if (origin.match(/^http:\/\/localhost(:\d+)?$/)) {
        callback(null, true);
        return;
      }
    }
    
    // In production, only allow specific origins
    const allowedOrigins = [
      process.env.CLIENT_URL,
      'https://shopsphere.vercel.app',
      'https://www.shopsphere.com',
    ].filter(Boolean) as string[];
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'X-CSRF-Token',
    'X-Correlation-Id',
  ],
  exposedHeaders: ['X-Correlation-Id'],
};

export const corsMiddleware = cors(corsOptions);
```

```typescript
// SECURITY FIX: Use environment variables for error handling