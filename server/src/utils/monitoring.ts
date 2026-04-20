```ts
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
});

// Initialize Sentry
export const initSentry = () => {
  if (process.env.SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      integrations: [
        new Sentry.Integrations.Http({ tracing: true }),
        new Tracing.Integrations.Express(),
        new Sentry.Integrations.OnUncaughtException(),
        new Sentry.Integrations.OnUnhandledRejection(),
      ],
      tracesSampleRate: 1.0,
      environment: process.env.NODE_ENV,
      release: process.env.npm_package_version,
    });
  }
};

// Capture error with Sentry
export const captureError = (error: Error, context?: Record<string, any>) => {
  logger.error({
    error: error.message,
    stack: error.stack,
    context,
    message: 'Error captured'
  });

  if (process.env.SENTRY_DSN) {
    Sentry.captureException(error, {
      extra: context,
    });
  }
};

// Capture message with Sentry
export const captureMessage = (message: string, level: Sentry.Severity = 'info', context?: Record<string, any>) => {
  logger[level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'info']({
    message,
    context,
  });

  if (process.env.SENTRY_DSN) {
    Sentry.captureMessage(message, level);
  }
};

// Start performance transaction
export const startTransaction = (name: string, op?: string) => {
  if (process.env.SENTRY_DSN) {
    return Sentry.startTransaction({
      name,
      op: op || 'function',
    });
  }
  return null;
};

// Add breadcrumb for user actions
export const addBreadcrumb = (breadcrumb: Sentry.Breadcrumb) => {
  if (process.env.SENTRY_DSN) {
    Sentry.addBreadcrumb(breadcrumb);
  }
};
```