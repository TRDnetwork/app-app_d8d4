# ShopSphere Payment Setup Guide

## Stripe Integration

ShopSphere uses Stripe as the primary payment gateway for secure, global transactions.

### Environment Variables

Add these to your `.env` file:

```env
# Stripe API Keys
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Frontend URL for redirects
FRONTEND_URL=http://localhost:5173
```

### Webhook Configuration

1. Install Stripe CLI: `npm install -g stripe`
2. Login: `stripe login`
3. Start webhook forwarding:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
4. Copy the webhook secret to `.env` as `STRIPE_WEBHOOK_SECRET`
5. In [Stripe Dashboard](https://dashboard.stripe.com/webhooks), add your production endpoint:
   ```
   https://your-api-domain.com/api/stripe/webhook
   ```

### Required Webhook Events

Ensure these events are enabled in Stripe Dashboard:
- `checkout.session.completed`
- `payment_intent.succeeded`
- `payment_intent.payment_failed`

### Testing Payments

Use these test card numbers:

| Card | Number | Description |
|------|--------|-------------|
| Visa | `4242 4242 4242 4242` | Succeeds |
| Visa (3D Secure) | `4000 0025 0000 3155` | Requires authentication |
| Declined | `4000 0000 0000 0002` | Always declines |

### Security Best Practices

1. **Never expose secret keys** in frontend code
2. **Verify webhook signatures** to prevent spoofing
3. **Use idempotency keys** for critical operations
4. **Validate all inputs** before processing payments
5. **Monitor failed payments** and webhook deliveries

### Production Checklist

- [ ] Update to live API keys
- [ ] Configure production webhook URL
- [ ] Enable Stripe Radar for fraud protection
- [ ] Set up payout schedule in Stripe Dashboard
- [ ] Implement payment failure notifications
- [ ] Monitor webhook delivery success rate
- [ ] Set up alerting for failed webhooks

### Troubleshooting

**Issue**: Webhook signature verification failed
- Solution: Ensure `STRIPE_WEBHOOK_SECRET` matches exactly with Stripe Dashboard

**Issue**: Session not found on confirmation page
- Solution: Check that `success_url` includes `{CHECKOUT_SESSION_ID}` placeholder

**Issue**: Duplicate orders from webhooks
- Solution: The system already prevents this by checking for existing `stripe_session_id`

**Issue**: CORS errors during checkout
- Solution: Ensure your frontend URL is added to Stripe Dashboard > Settings > CORS