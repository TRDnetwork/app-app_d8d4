```ts
import { Request, Response, NextFunction } from 'express';

export const securityHeaders = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Basic security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // Strict CSP
  const isProduction = process.env.NODE_ENV === 'production';
  const stripeKey = process.env.STRIPE_PUBLIC_KEY || '';
  
  const cspDirectives = [
    `default-src 'self'`,
    `script-src 'self' 'unsafe-inline' ${isProduction ? '' : "'unsafe-eval'"} https://js.stripe.com`,
    `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
    `img-src 'self' data: https: blob:`,
    `font-src 'self' https://fonts.gstatic.com`,
    `connect-src 'self' https://*.algolia.net https://*.algolianet.com https://*.stripe.com wss://*.stripe.com`,
    `frame-src https://js.stripe.com https://hooks.stripe.com`,
    `object-src 'none'`,
    `base-uri 'self'`,
  ].join('; ');

  res.setHeader('Content-Security-Policy', cspDirectives);

  // HSTS only in production
  if (isProduction) {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  next();
};
```