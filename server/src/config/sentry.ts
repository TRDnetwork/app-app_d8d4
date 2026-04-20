import * as Sentry from '@sentry/node';
import { RewriteFrames } from '@sentry/integrations';

// Configure Sentry for Node.js
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    // Enable Express.js middleware tracing
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Express({ app: null }), // Will be set later
    new RewriteFrames({
      // For source maps to work correctly in production
      iteratee: (frame) => {
        frame.filename = frame.filename?.replace(__dirname, 'app://');
        return frame;
      },
    }),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0,
  // Set sampling rate for profiling - this is relative to tracesSampleRate
  profilesSampleRate: 1.0,
});

export default Sentry;
```

```typescript
// SECURITY FIX: Use environment variables for health check