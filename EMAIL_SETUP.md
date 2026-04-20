# 📨 ShopSphere Email Setup Guide

This guide explains how to configure transactional emails for ShopSphere using Resend.

## 1. Get Your Resend API Key

1. Go to [resend.com](https://resend.com) and sign up or log in.
2. Navigate to **API Keys** and create a new API key.
3. Copy the key (it starts with `re_...`).

> 🔐 **Never commit this key to version control.**

## 2. Set Environment Variable on Vercel

1. Go to your Vercel project dashboard.
2. Navigate to **Settings > Environment Variables**.
3. Add a new variable:
   - **Key**: `RESEND_API_KEY`
   - **Value**: Paste your Resend API key
   - **Environment**: Add to Production, Preview, and Development
4. Redeploy your application.

> ❌ Do NOT use `VITE_RESEND_API_KEY` — this would expose the key to the browser.

## 3. Verify Your Sending Domain

1. In Resend dashboard, go to **Domains**.
2. Click **Add Domain** and enter your domain (e.g., `shopsphere.com`).
3. Add the required DNS records (TXT and CNAME) to your domain provider.
4. Wait for verification (usually a few minutes).

Once verified, you can send from `hello@shopsphere.com` or any subdomain.

## 4. Frontend Integration

The frontend sends email requests via `fetch` to the serverless function:

```ts
await fetch('/api/send-email', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    to: 'customer@example.com',
    subject: 'Order Confirmed #12345',
    html: '<strong>Hello</strong> world',
  }),
});
```

> ✅ The API key stays server-side — never exposed to the client.

## 5. Available Email Templates

- `OrderConfirmationEmail` — sent after successful purchase
- `PasswordResetEmail` — sent when user requests password reset
- `SellerApplicationReceivedEmail` — notifies admin of new seller application

## 6. Testing Emails

1. Use `delivered@resend.dev` as the recipient during development.
2. View sent emails in [Resend Dashboard > Activity](https://resend.com/activity).
3. For production, update `TO_EMAIL` in `api/send-email.ts` to your official address.

## 7. Best Practices

- Always include an unsubscribe link in marketing emails.
- Monitor bounce rates and spam complaints in Resend dashboard.
- Use meaningful `reply_to` addresses (e.g., `support@shopsphere.com`).
- Log email errors (but never log API keys or full email content).