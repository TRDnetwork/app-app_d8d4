# ShopSphere Payment Setup Guide

## Stripe Integration

ShopSphere uses Stripe for secure payment processing. Follow these steps to set up:

### 1. Environment Variables

Add these to your `.env` file:

```env
# Stripe API Keys
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Frontend URL for redirects
FRONTEND_URL=https://shopsphere.com
```

For development, use test keys:
```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 2. Webhook Configuration

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Create a new webhook endpoint
3. Set URL to: `https://your-api-domain.com/api/stripe/webhook`
4. Select events to listen for:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy the webhook secret and add to `.env` as `STRIPE_WEBHOOK_SECRET`

### 3. Testing Payments

Use these test card numbers:

| Card | Purpose |
|------|---------|
| `4242 4242 4242 4242` | Successful payment |
| `4000 0025 0000 3155` | Requires authentication (3D Secure) |
| `4000 0000 0000 9995` | Payment declined |

### 4. Production Checklist

- [ ] Replace test keys with live keys
- [ ] Verify domain in Stripe Dashboard
- [ ] Enable Radar for fraud protection
- [ ] Set up payout schedule
- [ ] Monitor webhook delivery in Stripe Dashboard
- [ ] Implement alerting for webhook failures

### 5. Security Best Practices

- Never expose `STRIPE_SECRET_KEY` in frontend code
- Always verify webhook signatures
- Use idempotency keys for critical operations
- Store `stripe_session_id` to prevent duplicate processing
- Validate order ownership before processing payments

### 6. Troubleshooting

**Webhook issues:**
- Use Stripe CLI for local testing: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
- Check webhook signature verification
- Ensure raw body parser is used for webhook endpoint

**Payment failures:**
- Check Stripe Dashboard for detailed error messages
- Verify amount is in cents (e.g., $10.00 = 1000)
- Ensure customer email is valid
- Confirm order exists in database before creating session
```