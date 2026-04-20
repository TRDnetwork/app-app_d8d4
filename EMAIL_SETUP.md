# ShopSphere Email Setup

## 1. Get Your Resend API Key
1. Go to [resend.com](https://resend.com) and create an account
2. Navigate to the Dashboard and find your API key
3. Copy the API key (it starts with `re_`)

## 2. Configure Environment Variables
Add the following environment variables to your Vercel project:

```bash
RESEND_API_KEY=re_your_api_key_here
FRONTEND_URL=https://your-shop-sphere-app.vercel.app
```

**Important Security Notes:**
- NEVER use `VITE_RESEND_API_KEY` or any `VITE_` prefixed variable - this would expose your API key to the client
- The API key is only used server-side in `api/send-email.ts`
- Set these variables in Vercel's Environment Variables section, NOT in a `.env` file in your repository

## 3. Frontend Integration
To send emails from your frontend, make a POST request to the serverless function:

```typescript
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
      orderNumber: 'ORD-123456',
      totalAmount: 99.99
    }
  }),
});
```

## 4. Available Email Templates
- `order-confirmation`: Sent when an order is placed
- `password-reset`: Sent when user requests password reset
- `welcome`: Sent to new users after registration
- `seller-application-received`: Sent when seller applies

## 5. Verify Your Sending Domain
For better deliverability:
1. Go to Resend Dashboard → Domains
2. Add and verify your domain (e.g., `shopsphere.com`)
3. Update the "from" address in `api/send-email.ts` to use your verified domain:
   ```ts
   from: 'ShopSphere <orders@shopsphere.com>',
   ```

## 6. Testing Emails
During development, you can use the test API key and the default `onboarding@resend.dev` from address. For production, always use a verified domain.

## 7. Monitoring
Check the Resend dashboard to monitor:
- Email delivery status
- Open rates
- Click tracking
- Bounces and spam complaints

Remember: All email sending happens server-side for security. The frontend only makes API calls to trigger emails.