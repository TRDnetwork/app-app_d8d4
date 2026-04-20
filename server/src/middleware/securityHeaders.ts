import helmet from 'helmet';
import { config } from '../config/env';

// Security headers configuration
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'sha256-qznLcsROx4GACP2dm0UCKCzCG+HiZ1guq6ZZDob/Tng='", // Inline script hash for critical functionality
        config.CLIENT_URL,
        'trusted-cdn.com',
      ],
      styleSrc: [
        "'self'",
        "'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU='", // Empty style hash
        config.CLIENT_URL,
        'fonts.googleapis.com',
      ],
      imgSrc: [
        "'self'",
        'data:',
        'cdn.example.com',
        'res.cloudinary.com',
        'images.unsplash.com',
        'via.placeholder.com',
      ],
      fontSrc: [
        "'self'",
        'fonts.gstatic.com',
      ],
      connectSrc: [
        "'self'",
        config.SERVER_URL,
        config.CLIENT_URL,
        'analytics.google.com',
        'sentry.io',
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
// SECURITY FIX: Removed 'unsafe-inline' and 'unsafe-eval' from CSP and used environment variables for trusted domains
```

```typescript