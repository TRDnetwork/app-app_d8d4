# ShopSphere Email Setup Guide

## 1. Get Your Resend API Key
1. Go to [resend.com](https://resend.com) and create an account
2. Navigate to Dashboard → API Keys
3. Create a new API key with full access
4. Copy the API key (it starts with `re_`)

## 2. Configure Environment Variables
**DO NOT** use VITE_* variables for the API key (they're exposed to the client).

In your Vercel project:
```bash
# Add to Vercel environment variables (Server Environment Variables)
RESEND_API_KEY=your_api_key_here
FRONTEND_URL=https://shopsphere.com
```

Or in `.env` file (never commit to git):
```env
RESEND_API_KEY=re_12345678_your_actual_key_here
FRONTEND_URL=http://localhost:5173
```

## 3. Verify Your Sending Domain
1. In Resend dashboard, go to Domains
2. Add your domain (e.g., `shopsphere.com` or `localhost`)
3. Add the required DNS records (TXT and CNAME) to verify ownership
4. Once verified, you can send from any address on that domain

## 4. Frontend Integration
The frontend calls the serverless function - never imports Resend directly:

```javascript
// Example: Sending order confirmation
await fetch('/api/send-email', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    type: 'order_confirmation',
    data: {
      customerName: 'John Doe',
      orderNumber: 'SSP-12345',
      total: 299.99,
      estimatedDelivery: '2024-01-15',
      items: [
        { name: 'Wireless Headphones', quantity: 1, price: 199.99, image: 'https://...' },
        { name: 'Charging Cable', quantity: 2, price: 49.99, image: 'https://...' }
      ]
    }
  })
});
```

## 5. Test Your Setup
1. Use `delivered@resend.dev` as the recipient for testing
2. Check the Resend dashboard for sent emails and delivery status
3. Monitor Vercel logs for any errors

## 6. Production Notes
- Replace `onboarding@resend.dev` with your verified domain email
- Set up email templates in Resend dashboard for brand consistency
- Monitor sending limits and upgrade plan as needed
- Implement proper error handling and retry logic for critical emails

## Troubleshooting
- **Emails not sending**: Check Vercel logs for API errors
- **API key errors**: Verify RESEND_API_KEY is set as server environment variable (not VITE_*)
- **Domain not verified**: Complete DNS verification in Resend dashboard
- **Rate limits**: Resend has sending limits based on your plan