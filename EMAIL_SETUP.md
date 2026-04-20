# ShopSphere Email Setup Guide

## 1. Get Your Resend API Key
1. Go to [resend.com](https://resend.com) and sign up for an account
2. Verify your email address
3. Navigate to the API section and create a new API key
4. Copy the API key (it starts with `re_`)

## 2. Configure Environment Variables
Add the Resend API key to your Vercel project environment variables:

```bash
# In Vercel Dashboard:
# Project Settings → Environment Variables

RESEND_API_KEY=your_api_key_here
```

**Important Security Note:**
- NEVER use `VITE_RESEND_API_KEY` or any `VITE_*` prefix
- `VITE_*` variables are exposed to the client bundle
- The API key must only be accessible server-side
- Use `process.env.RESEND_API_KEY` only in serverless functions

## 3. Verify Your Sending Domain (Recommended)
For better deliverability:
1. Go to Resend Dashboard → Domains
2. Add your domain (e.g., `shopsphere.com`)
3. Add the required DNS records (TXT and CNAME)
4. Wait for verification (usually a few minutes)

Once verified, update the "from" address in `api/send-email.ts`:
```ts
from: 'ShopSphere <hello@shopsphere.com>',
```

## 4. Frontend Integration
The frontend calls the serverless function - never imports email logic:

```ts
// Example: Send order confirmation
await fetch('/api/send-email', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    to: 'customer@example.com',
    template: 'order-confirmation',
    data: {
      orderNumber: 'ORD-123456',
      total: 99.99,
      estimatedDelivery: '2024-01-15',
    },
  }),
});
```

## 5. Available Templates
- `order-confirmation`: Sent after successful order placement
- `password-reset`: Sent when user requests password reset
- `seller-application-received`: Sent when seller applies
- `welcome`: Sent when new user registers

## 6. Testing
1. Use the Resend Dashboard to monitor email delivery
2. Test with real email providers (Gmail, Outlook, etc.)
3. Check spam folder if emails don't arrive
4. Verify domain improves deliverability significantly

## 7. Production Notes
- Use a custom domain for better branding and deliverability
- Monitor bounce rates and spam complaints in Resend dashboard
- Implement proper error handling in frontend
- Never log email content or API keys
- Rate limit email sending if needed