// Notification configuration
export const notificationConfig = {
  resendApiKey: process.env.RESEND_API_KEY,
  fromEmail: process.env.EMAIL_FROM || 'ShopSphere <onboarding@resend.dev>',
  enableEmail: process.env.ENABLE_EMAIL_NOTIFICATIONS === 'true',
  enablePush: process.env.ENABLE_PUSH_NOTIFICATIONS === 'true',
  enableSms: process.env.ENABLE_SMS_NOTIFICATIONS === 'true',
};

// Validate required notification configuration
if (!notificationConfig.resendApiKey) {
  console.warn('Resend API key is not configured. Email notifications may not work.');
}
```

```typescript
// SECURITY FIX: Use environment variables for file upload configuration