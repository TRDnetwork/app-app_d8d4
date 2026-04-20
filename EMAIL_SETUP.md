# ShopSphere Email Setup Guide

## 1. Get Your Resend API Key
1. Go to [resend.com](https://resend.com) and create an account
2. Navigate to the Dashboard → API Keys
3. Create a new API key with full access
4. Copy the API key (it starts with `re_`)

## 2. Configure Environment Variables
Add the following environment variables to your Vercel project:

```bash
RESEND_API_KEY=re_XXXXXXXXXXXXXXXXXXXXX
EMAIL_FROM=hello@shopsphere.com
```

**Important Security Notes:**
- `RESEND_API_KEY` is a secret and must NEVER be exposed to the client
- Do NOT use `VITE_RESEND_API_KEY` or any `VITE_*` prefix — these are exposed in the browser bundle
- The API key is only used server-side in `api/send-email.ts`
- Set these variables in Vercel's Environment Variables section (not in `.env.local`)

## 3. Verify Your Sending Domain
1. In Resend Dashboard, go to Domains
2. Add your domain (e.g., `shopsphere.com`)
3. Add the required DNS records (TXT and CNAME) to your domain registrar
4. Wait for verification (usually a few minutes)
5. Once verified, update `EMAIL_FROM` to use your domain (e.g., `hello@shopsphere.com`)

## 4. Frontend Integration
The frontend sends email requests via `fetch` to the serverless function:

```typescript
// Example: Send order confirmation
await fetch('/api/send-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    to: 'customer@example.com',
    template: 'order-confirmation',
    data: orderData
  })
});
```

**Never import email functionality directly in client code.** All email sending goes through `/api/send-email`.

## 5. Test Email Delivery
1. Use Resend Dashboard → Activity to monitor sent emails
2. For development, you can use `delivered@resend.dev` as the recipient to test without sending real emails
3. Check for delivery status, opens, and clicks in the Resend dashboard

## 6. Templates
Email templates are located in:
- `src/emails/` — React components that return HTML strings
- `api/send-email.ts` — Serverless function that renders and sends templates

Available templates:
- `order-confirmation` — Sent when an order is placed
- `password-reset` — Sent when user requests password reset
- `welcome` — Sent when a new user registers
- `seller-application-received` — Sent when a seller applies

## 7. Best Practices
- Always include an unsubscribe link in marketing emails
- Monitor bounce rates and spam complaints in Resend dashboard
- Use descriptive `Subject` lines
- Test responsive design on mobile devices
- Never log email content or API keys