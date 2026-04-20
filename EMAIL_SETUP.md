# 📨 ShopSphere Email Setup Guide

This document explains how to configure transactional email delivery for ShopSphere using Resend.

## 1. Get Your Resend API Key

1. Go to [resend.com](https://resend.com) and create an account
2. Navigate to **Dashboard > API Keys**
3. Click **Create API Key**
4. Copy the generated key (it starts with `re_`)

> 🔐 **Never commit this key to version control**

## 2. Configure Environment Variables

Add the following to your **Vercel project environment variables** (NOT in `.env` file):

| Key | Value |
|-----|-------|
| `RESEND_API_KEY` | Your Resend API key (e.g., `re_12345678...`) |
| `EMAIL_FROM` | Verified sender email (e.g., `hello@shopsphere.com`) |
| `FRONTEND_URL` | Your frontend URL (e.g., `https://shopsphere.vercel.app`) |

> ⚠️ **Do NOT use `VITE_RESEND_API_KEY`** — this would expose your secret to the browser. The API key is only used server-side in `api/send-email.ts`.

## 3. Verify Your Sending Domain

1. In Resend Dashboard, go to **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `shopsphere.com` or `shopsphere.vercel.app`)
4. Add the required DNS records (TXT and CNAME) to your domain provider
5. Wait for verification (usually a few minutes)

Once verified, emails will have better deliverability and won't be marked as spam.

## 4. Frontend Integration

The frontend sends email requests via `fetch` to the serverless function:

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
      orderNumber: 'ORD-12345',
      customerName: 'John Doe',
      items: [
        { name: 'Wireless Headphones', quantity: 1, price: '$99.99', image: 'https://...' }
      ],
      total: '$99.99',
      estimatedDelivery: 'March 15-18, 2024'
    }
  })
});
```

## 5. Available Email Templates

| Template | Trigger |
|--------|---------|
| `order-confirmation` | After successful payment |
| `password-reset` | When user requests password reset |
| `welcome` | After user registration |
| `seller-application-received` | After seller applies |

## 6. Testing

1. Run your app locally or deploy to Vercel
2. Trigger an email (e.g., register a new user)
3. Check the **Resend Dashboard > Emails** for delivery status
4. View email content and troubleshoot if needed

## 7. Production Tips

- Monitor email delivery in Resend dashboard
- Set up alerts for high failure rates
- Use a custom domain (not `resend.dev`) for better branding and deliverability
- Test with real email providers (Gmail, Outlook, etc.)