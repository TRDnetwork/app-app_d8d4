# ShopSphere Email Setup Guide

## 1. Get Your Resend API Key
1. Go to [resend.com](https://resend.com) and create an account
2. Verify your domain in the Resend dashboard
3. Navigate to API Keys and create a new key
4. Copy the API key (it starts with `re_`)

## 2. Configure Environment Variables
Add the following to your environment variables:

**For Vercel:**
```bash
RESEND_API_KEY=re_XXXXXXXXXXXXXXXXXXXXXX
```

**In your `.env.local` file:**
```bash
RESEND_API_KEY=re_XXXXXXXXXXXXXXXXXXXXXX
```

> ⚠️ **Security Note**: Never use `NEXT_PUBLIC_` prefix for the API key. This would expose it to the client-side.

## 3. Frontend Integration
The frontend calls the email API route using `fetch`:

```typescript
// Example: Sending order confirmation
await fetch('/api/send-email', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    to: 'customer@example.com',
    subject: 'Your ShopSphere Order #12345',
    html: '<html>...</html>', // Rendered from EmailVerification component
  }),
});
```

## 4. Domain Verification
1. In the Resend dashboard, add and verify your sending domain
2. Add the required DNS records (TXT and CNAME) to your domain registrar
3. Wait for verification (usually a few minutes)

## 5. Testing
1. Use the Resend dashboard to monitor email activity
2. Test all email flows:
   - Email verification
   - Password reset
   - Order confirmation
3. Check spam folder if emails aren't arriving

## 6. Production Best Practices
- Use a custom from address (e.g., `orders@shopsphere.com`) after domain verification
- Monitor bounce rates and spam complaints in the Resend dashboard
- Implement proper error handling in your API routes
- Never log email content or API keys