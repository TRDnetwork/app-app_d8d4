# ShopSphere Payment Setup Guide

## Stripe Integration

ShopSphere uses Stripe for secure payment processing. Follow these steps to set up payment functionality.

### 1. Environment Variables

Add the following to your `.env` file:

```env
# Stripe API Keys
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Frontend URL (for redirect after payment)
FRONTEND_URL=http://localhost:5173
```

> **Never commit API keys to version control.** Use `.env` and add to `.gitignore`.

### 2. Webhook Setup

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Run `stripe listen --forward-to localhost:5000/api/stripe/webhook`
3. Copy the webhook signing secret and add to `.env` as `STRIPE_WEBHOOK_SECRET`
4. In Stripe Dashboard, add webhook endpoint:
   - URL: `https://your-domain.com/api/stripe/webhook`
   - Events: `checkout.session.completed`, `invoice.paid`

### 3. Testing Payments

Use Stripe test cards:

- Success: `4242 4242 4242 4242`
- Requires SCA: `4000 0025 0000 3155`
- Decline: `4000 0000 0000 9995`

### 4. Production Checklist

- ✅ Replace test keys with live keys
- ✅ Set `FRONTEND_URL` to production domain
- ✅ Enable webhook in Stripe Dashboard
- ✅ Monitor failed webhooks and payments
- ✅ Implement alerting for payment failures

### 5. Security Notes

- Webhook signatures are verified using `STRIPE_WEBHOOK_SECRET`
- Idempotency keys prevent duplicate order creation
- All sensitive data handled server-side
- No secrets exposed in frontend code

### 6. Troubleshooting

| Issue | Solution |
|------|----------|
| "Stripe has not loaded" | Ensure `VITE_STRIPE_PUBLISHABLE_KEY` is set |
| Webhook 400 errors | Verify signature and `STRIPE_WEBHOOK_SECRET` |
| Session not found | Check `FRONTEND_URL` and redirect URIs |
| Payment fails silently | Check browser console and network tab |

For more details, see [Stripe Docs](https://stripe.com/docs).