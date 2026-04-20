# ShopSphere Email Setup Guide

## 1. Get Your Resend API Key
1. Go to [resend.com](https://resend.com) and create an account
2. Verify your domain (e.g., shopsphere.com) in the Resend dashboard
3. Navigate to API Keys and create a new API key
4. Copy the API key (it will look like `re_12345678-...`)

## 2. Configure Environment Variables
Add the following to your environment variables:

### Vercel Environment Variables
In your Vercel project dashboard:
- Go to Settings → Environment Variables
- Add:
  - Key: `RESEND_API_KEY`, Value: `[your-api-key]`
  - Key: `FRONTEND_URL`, Value: `https://shopsphere.com` (or your domain)

### Local Development (.env.local)
Create a `.env.local` file in your project root:
```
RESEND_API_KEY=re_12345678-...
FRONTEND_URL=http://localhost:3000
```

## 3. API Endpoints
The following email endpoints are available:

### Order Confirmation
```
POST /api/email/order-confirmation
```
Body:
```json
{
  "to": "customer@example.com",
  "orderNumber": "SPH-12345",
  "customerName": "John Doe",
  "items": [
    {
      "name": "Wireless Headphones",
      "quantity": 1,
      "price": 149.99
    }
  ],
  "total": 159.99,
  "estimatedDelivery": "2024-01-25"
}
```

### Password Reset
```
POST /api/email/password-reset
```
Body:
```json
{
  "to": "user@example.com",
  "userName": "John",
  "token": "abc123-reset-token"
}
```

### Welcome Email
```
POST /api/email/welcome
```
Body:
```json
{
  "to": "newuser@example.com",
  "userName": "Jane"
}
```

## 4. Frontend Integration
Call these endpoints from your frontend using fetch:

```typescript
// Example: Send order confirmation
await fetch('/api/email/order-confirmation', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    to: 'customer@example.com',
    orderNumber: 'SPH-12345',
    customerName: 'John Doe',
    items: orderItems,
    total: orderTotal
  }),
});
```

## 5. Testing
1. Use the Resend dashboard to monitor email delivery
2. Check the "Activity" tab to see sent emails and any delivery issues
3. Test with different email providers (Gmail, Outlook, etc.)

## 6. Best Practices
- Always verify your sending domain in Resend
- Monitor bounce rates and spam complaints
- Include unsubscribe links in marketing emails
- Use descriptive "From" names and addresses
- Test email templates across different devices and email clients

## Troubleshooting
- **Emails not sending**: Check that `RESEND_API_KEY` is correctly set in Vercel environment variables
- **Delivery delays**: Verify your domain and ensure you're not sending to spam traps
- **Formatting issues**: Test HTML templates using Resend's email testing tools
- **Rate limits**: Resend has rate limits; contact support if you need higher volumes