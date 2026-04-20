import helmet from 'helmet';

// Security headers configuration
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'strict-dynamic'",
        "'nonce-{{nonce}}'",
        "'unsafe-inline'",
        process.env.NODE_ENV === 'development' ? 'http://localhost:*' : '',
        process.env.NODE_ENV === 'development' ? 'ws://localhost:*' : '',
      ].filter(Boolean),
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        'https://fonts.googleapis.com',
      ],
      imgSrc: [
        "'self'",
        'data:',
        'https://*.amazonaws.com',
        'https://*.res.cloudinary.com',
        'https://*.unsplash.com',
        'https://*.stripe.com',
      ],
      fontSrc: [
        "'self'",
        'https://fonts.gstatic.com',
      ],
      connectSrc: [
        "'self'",
        'https://*.amazonaws.com',
        'https://*.resend.com',
        'https://*.stripe.com',
        'https://*.algolia.net',
        'https://*.algolianet.com',
        process.env.NODE_ENV === 'development' ? 'http://localhost:*' : '',
        process.env.NODE_ENV === 'development' ? 'ws://localhost:*' : '',
      ],
      frameSrc: ["'self'", 'https://*.stripe.com'],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'none'"],
      upgradeInsecureRequests: process.env.NODE_ENV === 'production',
    },
    useDefaults: true,
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