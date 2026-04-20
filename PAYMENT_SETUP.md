# Stripe Payment Integration Setup

## Environment Variables

Add these variables to your `.env` file:

```env
# Stripe API Keys
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Frontend environment variable (for Next.js)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## Setup Steps

1. **Create Stripe Account**
   - Go to [stripe.com](https://stripe.com) and create an account
   - Verify your business information
   - Get your API keys from the Dashboard → Developers → API keys

2. **Configure Webhooks**
   - Go to Dashboard → Developers → Webhooks
   - Add endpoint: `https://your-domain.com/api/webhooks/stripe`
   - Select events to listen to:
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
     - `charge.refunded`
   - Copy the webhook secret and add to `.env`

3. **Test Payment Flow**
   - Use Stripe test cards:
     - Successful payment: `4242 4242 4242 4242`
     - Failed payment: `4000 0000 0000 0002`
   - Test webhook locally using Stripe CLI:
     ```bash
     stripe listen --forward-to localhost:3000/api/webhooks/stripe
     stripe trigger payment_intent.succeeded
     ```

4. **Go Live**
   - Replace test keys with live keys
   - Update webhook endpoint to production URL
   - Remove test cards from code

## Security Best Practices

- Never expose `STRIPE_SECRET_KEY` on the client side
- Always verify webhook signatures
- Use idempotency keys for critical operations
- Implement rate limiting on payment endpoints
- Log all payment events for auditing

## Troubleshooting

- **Webhook not receiving events**: Check endpoint URL, verify SSL certificate, ensure server is accessible
- **PaymentIntent creation fails**: Verify API keys, check amount format (in cents), validate order ID
- **CardElement not rendering**: Ensure Stripe.js is loaded, check for CSS conflicts, verify publishable key