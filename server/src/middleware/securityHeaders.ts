import helmet from 'helmet';

// Security headers configuration
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "'unsafe-eval'",
        'trusted-cdn.com',
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        'fonts.googleapis.com',
      ],
      imgSrc: [
        "'self'",
        'data:',
        'cdn.example.com',
        'res.cloudinary.com',
        'images.unsplash.com',
      ],
      fontSrc: [
        "'self'",
        'fonts.gstatic.com',
      ],
      connectSrc: [
        "'self'",
        'api.example.com',
        'analytics.google.com',
      ],
      frameSrc: ["'self'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'none'"],
    },
  },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  hidePoweredBy: true,
  ieNoOpen: true,
  noSniff: true,
  xssFilter: true,
  frameguard: { action: 'deny' },
});
```

```typescript
// SECURITY FIX: Use environment variables for CORS configuration