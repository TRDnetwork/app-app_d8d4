// Security configuration
export const securityConfig = {
  // Rate limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX || '100'), // limit each IP to 100 requests per windowMs
  },
  
  // CORS
  cors: {
    origin: [
      process.env.CLIENT_URL || 'http://localhost:5173',
      'http://localhost:3000',
      'https://shopsphere.vercel.app',
    ],
    credentials: true,
  },
  
  // Helmet security headers
  helmet: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'",
          process.env.STRIPE_JS_URL || 'https://js.stripe.com',
          process.env.GOOGLE_FONTS_URL || 'https://fonts.googleapis.com',
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          process.env.GOOGLE_FONTS_URL || 'https://fonts.googleapis.com',
        ],
        imgSrc: [
          "'self'",
          'data:',
          'cdn.example.com',
          'res.cloudinary.com',
          'images.unsplash.com',
          process.env.S3_BUCKET_URL || 'https://*.s3.amazonaws.com',
        ],
        fontSrc: [
          "'self'",
          process.env.GOOGLE_FONTS_URL || 'https://fonts.gstatic.com',
        ],
        connectSrc: [
          "'self'",
          process.env.API_URL || 'https://api.shopsphere.com',
          process.env.STRIPE_API_URL || 'https://api.stripe.com',
          process.env.GOOGLE_ANALYTICS_URL || 'https://www.google-analytics.com',
        ],
        frameSrc: ["'self'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
      },
    },
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
  },
  
  // CSRF protection
  csrf: {
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      httpOnly: true,
    },
  },
};

// Validate required security configuration
if (!securityConfig.helmet.contentSecurityPolicy.directives.connectSrc.includes(process.env.STRIPE_API_URL || 'https://api.stripe.com')) {
  console.warn('Stripe API URL is not included in CSP connect-src. This may break payment functionality.');
}
```

```typescript
// SECURITY FIX: Update .env.example with all required environment variables