# Stripe Payment Integration Setup

## Environment Variables

Add these variables to your environment configuration:

### Frontend (.env)
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
FRONTEND_URL=http://localhost:5173
```

### Backend (.env)
```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
FRONTEND_URL=http://localhost:5173
```

## Setup Instructions

### 1. Create Stripe Account
- Go to [Stripe Dashboard](https://dashboard.stripe.com/)
- Sign up for an account
- Verify your business information
- Get your API keys from Developers > API Keys

### 2. Configure Webhooks
- Go to Developers > Webhooks
- Add endpoint: `https://your-domain.com/api/stripe/webhook`
- Select events to listen to:
  - `checkout.session.completed`
  - `payment_intent.payment_failed`
  - `payment_intent.succeeded`
- Copy the webhook signing secret and add to backend .env

### 3. Configure Webhook Endpoint
The webhook endpoint is already implemented at:
- `POST /api/stripe/webhook` - Handles Stripe events

### 4. Test Payment Flow
Use these test card numbers:

| Card | Number | Description |
|------|--------|-------------|
| Visa | `4242 4242 4242 4242` | Succeeds |
| Visa (Auth) | `4000 0025 0000 3155` | Requires authentication |
| Declined | `4000 0000 0000 0002` | Always declines |

### 5. Production Checklist
- [ ] Replace test API keys with live keys
- [ ] Set up proper domain in Stripe Dashboard
- [ ] Enable Radar for fraud protection
- [ ] Configure payout settings
- [ ] Set up webhook event monitoring
- [ ] Implement proper logging and alerting

## Security Considerations
- Never expose `STRIPE_SECRET_KEY` in frontend code
- Always verify webhook signatures
- Use HTTPS in production
- Implement idempotency for critical operations
- Store sensitive data securely

## Troubleshooting
- **Webhook signature verification failed**: Ensure `STRIPE_WEBHOOK_SECRET` matches exactly
- **Invalid API key**: Verify keys are correct and not expired
- **Payment not updating order status**: Check webhook endpoint is accessible and logs for errors
- **Session creation fails**: Verify required fields are provided and user is authenticated