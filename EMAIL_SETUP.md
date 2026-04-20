# ShopSphere Email Setup Guide

## 1. Get Your Resend API Key
1. Go to [resend.com](https://resend.com) and sign up for an account
2. Navigate to the Dashboard and copy your API key (starts with `re_`)
3. **Important**: Keep this key secret - never commit it to version control

## 2. Configure Environment Variables
Add the following to your Vercel project environment variables (Settings → Environment Variables):

```
RESEND_API_KEY=re_XXXXXXXXXXXXXXXXXXXXX
EMAIL_FROM=hello@shopsphere.com
```

**Critical Security Note**: Do NOT use `VITE_RESEND_API_KEY` or any `VITE_*` prefix. These variables are exposed to the client bundle. The API key must only be accessible server-side.

## 3. Verify Your Sending Domain
1. In the Resend dashboard, add and verify your sending domain (e.g., `shopsphere.com`)
2. This improves email deliverability and prevents messages from being marked as spam
3. Use `delivered@resend.dev` for testing during development

## 4. Frontend Integration
The frontend sends email requests via POST to the serverless function:

```javascript
// Example: Send order confirmation
await fetch('/api/send-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    to: 'customer@example.com',
    template: 'order-confirmation',
    data: {
      userName: 'John Doe',
      orderNumber: 'ORD-12345',
      totalAmount: 299.99,
      items: [
        { title: 'Wireless Headphones', quantity: 1, price: 199.99 },
        { title: 'Charging Cable', quantity: 2, price: 49.99 }
      ]
    }
  })
});
```

## 5. Available Templates
- `order-confirmation`: Sent when an order is placed
- `password-reset`: Sent when user requests password reset
- `welcome`: Sent to new user registrations
- `seller-application-received`: Sent when seller applies

## 6. Testing
- Monitor email delivery in the Resend dashboard
- Check server logs for any errors
- Test all email flows in staging before production deployment

## 7. Best Practices
- Always handle email sending errors gracefully in your application
- Never log email content or API keys
- Use descriptive subject lines and mobile-responsive designs
- Include clear unsubscribe links in marketing emails (not needed for transactional)