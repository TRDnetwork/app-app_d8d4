# 🛍️ ShopSphere Payment Integration Setup

This document outlines the Stripe payment integration for ShopSphere e-commerce platform.

## 🔐 Environment Variables

Add these to your `.env` file:

```env
# Stripe API Keys
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Application URL
NEXT_PUBLIC_APP_URL=https://shopsphere.com
```

## 🚀 Stripe Dashboard Setup

1. **Create Stripe Account**
   - Go to [stripe.com](https://stripe.com)
   - Sign up and verify your business details

2. **Get API Keys**
   - Dashboard → Developers → API Keys
   - Copy `Secret Key` and `Publishable Key`
   - Store in `.env` (never commit to git)

3. **Configure Webhooks**
   - Dashboard → Developers → Webhooks
   - Add endpoint: `https://your-domain.com/api/webhooks/stripe`
   - Select events:
     - `checkout.session.completed`
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
   - Copy the "Signing secret" and add to `.env` as `STRIPE_WEBHOOK_SECRET`

4. **Set Allowed Origins**
   - Dashboard → Developers → Settings
   - Add your frontend URLs to "Allowed origins"

## 🧪 Testing Payments

### Test Card Numbers
- Visa: `4242 4242 4242 4242`
- Mastercard: `5555 5555 5555 4444`
- Amex: `3782 822463 10005`

### Test Scenarios
| Scenario | Card Number | Result |
|--------|-------------|--------|
| Success | Any test card | Payment succeeds |
| Insufficient Funds | `4000 0000 0000 9995` | Payment fails |
| Requires Authentication | `4000 0025 0000 3155` | 3D Secure flow |

### Local Testing with Stripe CLI
```bash
# Install Stripe CLI
brew install stripe

# Login
stripe login

# Start webhook forwarder
stripe listen --forward-to localhost:5000/api/webhooks/stripe

# Copy the webhook secret to your .env
# Use in another terminal:
stripe trigger checkout.session.completed
```

## 📂 File Structure
```
/server
  /src
    /routes
      payment.routes.js        # POST /api/payment/create-checkout-session
    /webhooks
      stripe.webhook.js        # POST /api/webhooks/stripe
/client
  /src
    /components
      CheckoutForm.jsx         # Address form
      DeliveryOptions.jsx      # Shipping selection
      PaymentForm.jsx          # Stripe Embedded Checkout
    /app
      checkout/page.tsx        # Multi-step checkout
      order-confirmation/page.tsx # Success page
```

## ✅ Verification Steps

1. **Frontend**
   - [ ] Address form validates required fields
   - [ ] Delivery options update shipping cost
   - [ ] Stripe Embedded Checkout loads
   - [ ] Success redirect to `/order-confirmation`

2. **Backend**
   - [ ] `/api/payment/create-checkout-session` returns client secret
   - [ ] Webhook endpoint receives and verifies events
   - [ ] Database updates order status on successful payment

3. **Security**
   - [ ] All API keys are in environment variables
   - [ ] Webhook signatures are verified
   - [ ] No sensitive data logged
   - [ ] HTTPS enforced in production

## 🚨 Error Handling

| Error | Solution |
|------|----------|
| `Invalid API Key` | Verify `STRIPE_SECRET_KEY` is correct |
| `Webhook signature verification failed` | Ensure `STRIPE_WEBHOOK_SECRET` matches dashboard |
| `Customer email is required` | Frontend must send customerDetails.email |
| `401 Unauthorized` | Check CORS settings and API route protection |

## 📈 Monitoring

- Set up alerts for:
  - Failed webhook deliveries
  - High payment failure rates (>10%)
  - Sudden drop in conversion rate
- Monitor using Stripe Dashboard → Balance & Events
- Log all payment-related errors to your application monitoring tool

## 🔄 Next Steps

1. Implement order status updates in MongoDB
2. Connect payment success to inventory deduction
3. Set up email notifications (order confirmation, shipping updates)
4. Add refund processing flow
5. Implement subscription support if needed
```