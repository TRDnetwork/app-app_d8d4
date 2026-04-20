import cors from 'cors';
import { config } from '../config/env';

// CORS configuration
export const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      callback(null, true);
      return;
    }
    
    const allowedOrigins = [
      config.CLIENT_URL,
      'https://shopsphere.vercel.app',
    ].filter(Boolean) as string[];
    
    // Check if the origin is in our allowed list
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // In development, allow localhost with any port
      if (config.NODE_ENV === 'development' && 
          (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:'))) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
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
  ],
};

export const corsMiddleware = cors(corsOptions);
// SECURITY FIX: Improved CORS validation to properly handle null origins and restrict localhost to development
```

```typescript