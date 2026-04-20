# ShopSphere Email Setup Guide

## 1. Get Your Resend API Key
1. Go to [resend.com](https://resend.com) and sign up for a free account
2. Verify your domain (e.g., shopsphere.com) in the Resend dashboard
3. Navigate to API Keys and create a new key
4. Copy the API key (it will look like `re_12345678...`)

## 2. Configure Environment Variables
Add your Resend API key to your Vercel project environment variables:

```bash
# In Vercel dashboard or via CLI
RESEND_API_KEY=your_actual_api_key_here
```

**Important Security Note**: Never use `VITE_RESEND_API_KEY` or any `VITE_*` prefix. These variables are exposed to the client bundle. The API key must only be accessible server-side.

## 3. Integrate with Your Application
The frontend should call the email API endpoint without importing any email libraries:

```javascript
// In your frontend code (e.g., after order placement)
await fetch('/api/email/order-confirmation', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    to: 'customer@example.com',
    order: {
      id: 'ORD-7X8K2M9N',
      date: '2023-12-01',
      status: 'Confirmed',
      items: [...],
      subtotal: 299.98,
      shipping: 9.99,
      tax: 24.00,
      total: 333.97
    }
  }),
});
```

## 4. Verify Domain in Resend
For production emails to reach inboxes:
1. Go to Domains in your Resend dashboard
2. Add and verify your domain (e.g., `shopsphere.com`)
3. Update DNS records as instructed (TXT and CNAME records)
4. Once verified, replace the default `onboarding@resend.dev` sender with your verified email (e.g., `orders@shopsphere.com`)

## 5. Test the Integration
1. Place a test order in your application
2. Check the server logs for any email sending errors
3. Verify the email arrives in the recipient's inbox (check spam folder if not)
4. Test edge cases: invalid email addresses, network failures, etc.

## Troubleshooting
- **Emails not sending**: Check Vercel logs for 5xx errors and verify `RESEND_API_KEY` is set
- **Rate limiting**: Resend free tier allows 100 emails/month. Upgrade plan as needed
- **Template issues**: Ensure all required data is passed from frontend to the API
- **Security**: Never expose the API key in client-side code or version control

The email system is now ready for production use with secure, server-side email delivery.