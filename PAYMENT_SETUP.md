# 🛢️ ShopSphere Payment Setup Guide

## Stripe Integration

ShopSphere uses Stripe for secure, reliable payment processing. This guide covers setup, configuration, and best practices.

### 1. Environment Variables

Add these to your `.env` file:

```env
# Stripe API Keys
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Frontend URL for redirects
FRONTEND_URL=https://shopsphere.vercel.app

# Backend URL for webhooks
BACKEND_URL=https://shopsphere-api.onrender.com
```

> **Never commit these keys to version control.** Use Vercel/Railway environment variables.

### 2. Stripe Dashboard Setup

1. **Create Account**: [stripe.com](https://stripe.com)
2. **Get API Keys**:
   - Developers → API Keys → Copy `Secret Key` and `Publishable Key`
3. **Configure Webhooks**:
   - Developers → Webhooks → Add Endpoint
   - URL: `https://shopsphere-api.onrender.com/api/stripe/webhook`
   - Events: `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`
   - Copy the **Signing Secret** and add to `.env`

### 3. Testing Payments

Use Stripe test cards:

| Card | Purpose |
|------|--------|
| `4242 4242 4242 4242` | Successful payment |
| `4000 0025 0000 3155` | Requires SCA (3D Secure) |
| `4000 0000 0000 9995` | Payment declined |

### 4. Webhook Security

- **Signature Verification**: All webhook requests are verified using `STRIPE_WEBHOOK_SECRET`
- **Idempotency**: Processed event IDs are stored with TTL to prevent replay attacks
- **HTTPS Required**: Webhooks only accept HTTPS endpoints

### 5. Production Checklist

- [ ] Replace test keys with live keys
- [ ] Verify webhook endpoint is publicly accessible
- [ ] Enable fraud detection (Radar)
- [ ] Set up payout schedule
- [ ] Monitor failed payments in Stripe Dashboard
- [ ] Implement refund workflow

### 6. Error Handling

Common issues and solutions:

| Error | Solution |
|------|----------|
| `Webhook signature verification failed` | Verify `STRIPE_WEBHOOK_SECRET` matches dashboard |
| `Invalid API Key` | Check `STRIPE_SECRET_KEY` format and permissions |
| `401 Unauthorized` | Ensure `verifyToken` middleware passes JWT |
| `Order not found` | Check `stripe_session_id` is saved to Order model |

### 7. Monitoring

- **Stripe Dashboard**: Monitor payments, disputes, and payouts
- **Application Logs**: Watch for webhook processing errors
- **Sentry/LogRocket**: Track frontend payment errors
- **Alerts**: Set up email/SMS alerts for failed payments

### 8. Compliance

- PCI DSS Level 1 compliant (handled by Stripe)
- GDPR-compliant data handling
- No sensitive data stored in MongoDB
- All payment data transmitted over HTTPS