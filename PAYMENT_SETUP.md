# ShopSphere Payment Integration Setup

## Stripe Configuration

### 1. Environment Variables
Add these to your `.env` file:

```env
# Stripe API Keys
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Frontend URL for redirects
FRONTEND_URL=http://localhost:5173
```

### 2. Webhook Setup
1. Install Stripe CLI: `npm install -g stripe`
2. Login: `stripe login`
3. Start webhook forwarding:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```
4. Copy the webhook signing secret and add to `.env`
5. In [Stripe Dashboard](https://dashboard.stripe.com/webhooks), add your production endpoint:
   - URL: `https://your-api-domain.com/api/stripe/webhook`
   - Events: `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`

### 3. Payment Flow
1. User selects address, delivery speed, and payment method in checkout
2. Frontend calls `/api/stripe/create-checkout-session` with order details
3. Backend creates pending order in MongoDB and Stripe Checkout Session
4. User redirected to Stripe Checkout
5. On payment success, Stripe sends webhook to `/api/stripe/webhook`
6. Webhook updates order status and reduces product inventory

### 4. Testing
Use Stripe test cards:
- Successful payment: `4242 4242 4242 4242`
- Requires authentication: `4000 0025 0000 3155`
- Declined: `4000 0000 0000 0002`

### 5. Security
- Webhook signatures are verified
- Idempotency: Orders are checked for duplicate processing
- JWT authentication on checkout session creation
- No sensitive data stored client-side

### 6. Production Checklist
- [ ] Replace test keys with live keys
- [ ] Update FRONTEND_URL to production domain
- [ ] Enable Stripe Radar for fraud protection
- [ ] Set up payout schedule in Stripe Dashboard
- [ ] Monitor webhook delivery in Stripe Dashboard
- [ ] Implement alerting for failed webhooks