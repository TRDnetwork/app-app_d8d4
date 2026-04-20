# 📨 ShopSphere Email Setup Guide

This guide explains how to configure transactional emails for ShopSphere using Resend.

## 1. Get Your Resend API Key

1. Go to [resend.com](https://resend.com) and sign up or log in.
2. Navigate to **Dashboard > API Keys**.
3. Click **Create API Key** and give it a name like `shop-sphere-production`.
4. Copy the generated key (it starts with `re_...`).

> 🔐 **Never commit this key to version control.**

## 2. Set Environment Variables

Add the following to your **Vercel project environment variables** (NOT in `.env` file):

```env
RESEND_API_KEY=re_XXXXXXXXXXXXXXXX
EMAIL_FROM=hello@shopsphere.com
```

> ⚠️ **Important**: Do NOT use `VITE_RESEND_API_KEY` — that would expose the key to the browser. The API key is only used server-side in `api/send-email.ts`.

## 3. Verify Your Sending Domain (Recommended)

1. In Resend dashboard, go to **Domains**.
2. Click **Add Domain** and enter your domain (e.g., `shopsphere.com`).
3. Add the DNS records (TXT and CNAME) to your domain provider.
4. Once verified, update `EMAIL_FROM` to `hello@shopsphere.com`.

This improves email deliverability and brand trust.

## 4. Frontend Integration

The frontend sends email requests via `fetch` to the serverless function:

```ts
await fetch('/api/send-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    to: 'customer@example.com',
    template: 'order-confirmation',
    data: {
      orderNumber: 'ORD-123456',
      customerName: 'John Doe',
      total: '$199.99',
    },
  }),
});
```

> ✅ **Rule**: Never import `resend` or email templates in frontend code. All email logic is server-side.

## 5. Available Templates

- `order-confirmation` — Sent after successful order
- `password-reset` — Sent when user requests password reset
- `welcome` — Sent after user registration
- `seller-application-received` — Sent when seller applies

## 6. Testing

1. Run locally with `vercel dev` or deploy to Vercel.
2. Trigger an email (e.g., register a user).
3. Check the **Resend dashboard** for delivery status and logs.

## 7. Monitoring

- Use Resend dashboard to monitor delivery rates, opens, and errors.
- Set up alerts for failed deliveries.
- Log email events in your analytics system.