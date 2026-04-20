# ShopSphere Email Setup Guide

## 1. Get Your Resend API Key
1. Sign up at [resend.com](https://resend.com) if you don't have an account
2. Navigate to the dashboard and create a new API key
3. Copy the API key (it starts with `re_`)

## 2. Configure Environment Variables
Add the following environment variable to your Vercel project:

```bash
RESEND_API_KEY=re_your_api_key_here
```

**Important Security Notes:**
- Never use `VITE_RESEND_API_KEY` or any `VITE_*` prefix - this would expose your API key to the client
- The API key is only used server-side in `api/send-email.ts`
- Use Vercel's environment variable management for production

## 3. Verify Your Sending Domain (Production)
For better deliverability in production:
1. Go to Resend Dashboard → Domains
2. Add and verify your domain (e.g., `shopsphere.com`)
3. Update the `TO_EMAIL` in `api/send-email.ts` to use your verified domain
4. Update the `FROM_EMAIL` to a verified sender (e.g., `hello@shopsphere.com`)

## 4. Frontend Integration
The frontend sends email requests to the serverless function:

```javascript
// Example: Send order confirmation
await fetch('/api/send-email', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    type: 'order_confirmation',
    data: {
      customerName: 'John Doe',
      orderNumber: 'ORD-12345678',
      // ... other order data
    }
  })
});
```

## 5. Available Email Types
- `order_confirmation` - Sent after successful order placement
- `password_reset` - Sent when user requests password reset
- `welcome` - Sent to new users after registration
- `seller_application_received` - Sent to admin when seller applies

## 6. Testing
1. Use `delivered@resend.dev` as the recipient for testing
2. Check the Resend dashboard for sent emails and delivery status
3. Test all email types with sample data
4. Verify responsive design on mobile devices

## 7. Monitoring
- Monitor email delivery in the Resend dashboard
- Set up alerts for failed deliveries
- Check spam folder during testing
- Review bounce rates and adjust content as needed

## 8. Best Practices
- Always test with real email providers (Gmail, Outlook, etc.)
- Keep email content concise and scannable
- Use clear call-to-action buttons
- Include unsubscribe links for marketing emails (not needed for transactional)
- Respect user privacy - never include sensitive information