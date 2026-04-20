# ShopSphere Email Setup Guide

## 1. Get Your Resend API Key
1. Go to [resend.com](https://resend.com) and create an account
2. Navigate to the Dashboard → API Keys
3. Create a new API key with full access
4. Copy the API key (it starts with `re_`)

## 2. Configure Environment Variables
Add the following to your Vercel project environment variables (NOT in `.env` file):

```
RESEND_API_KEY=re_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

**Important Security Notes:**
- Never use `VITE_RESEND_API_KEY` or any `VITE_*` prefix — this would expose your API key to the client
- The API key is only used server-side in `api/send-email.ts`
- Use `process.env.RESEND_API_KEY` only in serverless functions

## 3. Verify Your Sending Domain
1. In Resend Dashboard, go to Domains
2. Add your domain (e.g., `shopsphere.com`)
3. Add the required DNS records (TXT and CNAME) to your domain registrar
4. Wait for verification (usually a few minutes)

For development, emails will send from `onboarding@resend.dev`. In production, they'll send from your verified domain (e.g., `hello@shopsphere.com`).

## 4. Frontend Integration
The frontend calls the email service via:

```javascript
fetch('/api/send-email', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    type: 'order_confirmation',
    data: { /* email-specific data */ }
  })
})
```

**Never import or use Resend SDK on the client side.** All email sending happens through the serverless function.

## 5. Test Email Delivery
Use Resend's test recipient for development:
- Email: `delivered@resend.dev`
- This email will always "deliver" and can be viewed at [resend.com/email-testing](https://resend.com/email-testing)

## 6. Monitor Email Performance
- Check the Resend Dashboard for delivery rates, opens, and clicks
- Set up alerts for failed deliveries
- Monitor spam complaint rates

## Supported Email Types
- `order_confirmation`: Sent when an order is placed
- `password_reset`: Sent when user requests password reset
- `welcome`: Sent when a new user registers
- `seller_application_received`: Sent when a seller applies to join

## Troubleshooting
- **Emails not sending**: Check Vercel logs for `api/send-email` function
- **API key errors**: Verify the key is set in Vercel environment variables
- **Delivery issues**: Ensure your domain is verified in Resend
- **Template problems**: Test with `delivered@resend.dev` and inspect the HTML

For further assistance, refer to the [Resend Documentation](https://resend.com/docs).