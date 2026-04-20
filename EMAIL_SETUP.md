# ShopSphere Email Setup Guide

## 1. Get Resend API Key
1. Go to [resend.com](https://resend.com) and create an account
2. Navigate to Dashboard → API Keys
3. Create a new API key with email sending permissions
4. Copy the API key (starts with `re_`)

## 2. Configure Environment Variables
Add these variables to your Vercel project environment (NOT in client-side `.env` files):

```bash
# Vercel Dashboard → Project → Settings → Environment Variables
RESEND_API_KEY=re_XXXXXXXXXXXXXXXX  # Server-side only
FRONTEND_URL=https://shopsphere.vercel.app  # Your production URL
```

**Critical Security Note**: Never use `VITE_RESEND_API_KEY` or expose the API key to the client bundle.

## 3. Verify Sending Domain
1. In Resend Dashboard, go to Domains
2. Add and verify your domain (e.g., `shopsphere.vercel.app`)
3. Update DNS records as instructed by Resend
4. Once verified, update the `from` address in your email calls to use your domain

## 4. Frontend Integration
The frontend calls the serverless function without importing email libraries:

```typescript
// Example: Sending password reset email
await fetch('/api/send-email', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    to: 'user@example.com',
    type: 'password_reset',
    data: {
      resetLink: `${window.location.origin}/reset-password?token=abc123`
    }
  })
});
```

## 5. Available Email Types
- `order_confirmation`: { orderNumber, total, items[] }
- `password_reset`: { resetLink }
- `welcome`: { name }
- `seller_application_received`: { businessName }

## 6. Testing
- Use `delivered@resend.dev` as a test recipient to verify emails without sending
- Monitor sent emails in Resend Dashboard → Emails
- Check Vercel logs for serverless function errors

## 7. Production Requirements
- Verify your sending domain in Resend for better deliverability
- Replace `onboarding@resend.dev` with your verified domain email
- Implement proper error handling and retry logic for critical emails
- Never log sensitive data from email requests/responses