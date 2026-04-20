# ShopSphere Payment Setup Guide

## Stripe Integration

ShopSphere uses Stripe as the primary payment gateway for secure and reliable transactions.

### Environment Variables

Add these variables to your `.env` file:

```env
# Stripe API Keys
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Application URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000
```

### Webhook Setup

1. Install Stripe CLI:
```bash
npm install -g stripe
```

2. Login to Stripe CLI:
```bash
stripe login
```

3. Start webhook forwarding:
```bash
stripe listen --forward-to localhost:5000/api/stripe/webhook
```

4. Copy the webhook signing secret and add it to your `.env` file.

5. In Stripe Dashboard, go to Developers > Webhooks and add a new endpoint:
   - URL: `https://your-domain.com/api/stripe/webhook`
   - Events: `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`

### Testing Payments

Use these test card numbers:

- 4242 4242 4242 4242 - Succeeds instantly
- 4000 0025 0000 3155 - Requires SCA (3D Secure)
- 4000 0000 0000 9995 - Payment fails

### Security Considerations

1. **Webhook Verification**: Always verify the `stripe-signature` header to prevent fake webhook calls.
2. **HTTPS**: Ensure your production environment uses HTTPS.
3. **Rate Limiting**: Implement rate limiting on payment endpoints.
4. **Input Validation**: Validate all payment-related inputs on the server.

### Monitoring

Monitor these key metrics:
- Failed webhook deliveries
- High payment failure rates
- Conversion drop-offs at checkout
- Unusual transaction patterns

### Troubleshooting

**Common Issues:**
- Webhook signature verification failed: Ensure `STRIPE_WEBHOOK_SECRET` matches the one from Stripe Dashboard
- 400 errors on checkout: Check that all required fields are included in the session creation
- Payment not reflecting in database: Verify webhook endpoint is publicly accessible

**Debugging:**
- Use Stripe CLI to test webhooks locally
- Check Stripe Dashboard > Developers > Logs for API call details
- Enable verbose logging in development