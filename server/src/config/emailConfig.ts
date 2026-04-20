// Email configuration
export const emailConfig = {
  host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
  from: process.env.EMAIL_FROM || 'ShopSphere <noreply@shopsphere.com>',
};

// Validate required email configuration
if (!emailConfig.auth.user || !emailConfig.auth.pass) {
  console.warn('Email configuration is incomplete. Some email features may not work.');
}
```

```typescript
// SECURITY FIX: Use environment variables for Stripe keys