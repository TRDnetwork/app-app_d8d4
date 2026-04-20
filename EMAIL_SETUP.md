# ShopSphere Email Setup Guide

## 1. Get Your Resend API Key
1. Go to [resend.com](https://resend.com) and sign up for an account
2. Verify your email address
3. Navigate to the API section and copy your API key

## 2. Configure Environment Variables
Add your Resend API key to your Vercel project environment variables:

```bash
# In Vercel Dashboard → Project Settings → Environment Variables
RESEND_API_KEY=your_api_key_here
```

**Important**: Do NOT use `VITE_RESEND_API_KEY` or any `VITE_` prefix. This is a server-side secret and must not be exposed to the client.

## 3. Verify Your Sending Domain (Recommended)
For better deliverability:
1. In Resend dashboard, go to Domains
2. Add your domain (e.g., `shopsphere.com`)
3. Add the required DNS records (TXT and CNAME) to your domain provider
4. Wait for verification (usually a few minutes)

## 4. Frontend Integration
The frontend sends email requests to the serverless function. Never import Resend SDK on the client.

Example usage:
```javascript
// To send an order confirmation
await fetch('/api/send-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    to: 'customer@example.com',
    type: 'order_confirmation',
    data: {
      userName: 'John Doe',
      orderNumber: 'ORD-7X8K2M9N',
      total: 259.97,
      estimatedDelivery: 'Oct 20, 2023'
    }
  })
});

// To send a password reset
await fetch('/api/send-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    to: 'user@example.com',
    type: 'password_reset',
    data: { resetLink: 'https://shopsphere.com/reset-password?token=abc123' }
  })
});
```

## 5. Available Email Templates
- `order_confirmation`: Sent when an order is placed
- `password_reset`: Sent when user requests password reset
- `welcome`: Sent to new users after registration
- `seller_application_received`: Sent when seller applies

## 6. Testing
Use `delivered@resend.dev` as a test recipient to verify emails are sent correctly without spamming real users.

## 7. Monitoring
Check the Resend dashboard for:
- Delivery rates
- Open rates
- Bounce reports
- Complaints

## Troubleshooting
- **Emails not sending**: Check Vercel logs for the `/api/send-email` function
- **API key errors**: Verify `RESEND_API_KEY` is set in Vercel environment variables
- **Template issues**: Ensure all required data fields are provided in the request
- **Deliverability problems**: Verify your domain in Resend dashboard