import rateLimit from 'express-rate-limit';

// Rate limiting for authentication endpoints
export const authRateLimit = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.AUTH_RATE_LIMIT_MAX || '5'), // limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting for password reset endpoints
export const passwordResetRateLimit = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '3600000'), // 1 hour
  max: parseInt(process.env.PASSWORD_RESET_RATE_LIMIT_MAX || '3'), // limit each IP to 3 requests per windowMs
  message: 'Too many password reset attempts from this IP, please try again after 1 hour',
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting for email verification endpoints
export const emailVerificationRateLimit = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.EMAIL_VERIFICATION_RATE_LIMIT_MAX || '3'), // limit each IP to 3 requests per windowMs
  message: 'Too many email verification attempts from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting for general API endpoints
export const apiRateLimit = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.API_RATE_LIMIT_MAX || '100'), // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});
// PERF: Added rate limiting to all sensitive endpoints including general API endpoints
```

```typescript