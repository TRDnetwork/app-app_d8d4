# ShopSphere Email Setup Guide

## 1. Get Your Resend API Key
1. Go to [resend.com](https://resend.com) and sign up for a free account
2. Verify your domain (e.g., `shopsphere.com`) in the Resend dashboard
3. Navigate to **API Keys** and create a new API key
4. Copy the API key (it starts with `re_`)

## 2. Configure Environment Variables
Add the Resend API key to your Vercel project environment variables:

```bash
# Vercel CLI
vercel env add RESEND_API_KEY production
```

Or manually add it in the Vercel dashboard:
- Key: `RESEND_API_KEY`
- Value: `re_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`
- Environment: `Production`, `Preview`, and `Development`

**Important**: Do NOT use `VITE_RESEND_API_KEY` or any `VITE_` prefix — this would expose the key to the client.

## 3. Frontend Integration
The frontend sends order confirmation requests to the serverless function:

```javascript
// After successful Stripe payment
await fetch('/api/email/order-confirmation', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    to: 'customer@example.com',
    order: orderData
  }),
});
```

## 4. Verify Your Sending Domain
1. In the Resend dashboard, go to **Domains**
2. Add your domain (e.g., `shopsphere.com`)
3. Add the required DNS records (TXT and CNAME) to your domain registrar
4. Wait for verification (usually a few minutes)

## 5. Test the Integration
1. Place a test order through the checkout flow
2. Check the Vercel logs for the `api/email/order-confirmation` function
3. Verify the email arrives in the customer's inbox (check spam folder if needed)

## Troubleshooting
- **401 Unauthorized**: Check that `RESEND_API_KEY` is set in Vercel environment variables
- **Email not received**: Verify your domain in Resend dashboard and check DNS settings
- **Template issues**: Test the HTML output locally before deployment
- **Rate limits**: Resend free tier allows 100 emails/month — upgrade for production traffic

For more details, visit [Resend Documentation](https://resend.com/docs).