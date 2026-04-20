# ShopSphere Payment Integration Setup

## Stripe Configuration

### 1. Environment Variables
Add these variables to your `.env` file:

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
STRIPE_WEBHOOK_SECRET=whsec_...
FRONTEND_URL=http://localhost:5173
```

### 2. Webhook Setup
1. Install Stripe CLI: `npm install -g stripe`
2. Login: `stripe login`
3. Start webhook forwarding:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```
4. Copy the webhook signing secret and add it to your `.env` file
5. In [Stripe Dashboard](https://dashboard.stripe.com/webhooks), add your production endpoint:
   - URL: `https://yourdomain.com/api/stripe/webhook`
   - Events: `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`

### 3. Required Events
Ensure these events are enabled in your Stripe Dashboard:
- `checkout.session.completed`
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `invoice.paid` (if using subscriptions)

### 4. Security Configuration
1. **Signature Verification**: The webhook handler verifies the signature using `STRIPE_WEBHOOK_SECRET`
2. **Idempotency**: Checkout session IDs are stored to prevent replay attacks
3. **JWT Authentication**: The create session endpoint requires authenticated users (JWT in header)

### 5. Testing
Use these test card numbers:

| Card | Purpose |
|------|---------|
| `4242 4242 4242 4242` | Successful payment |
| `4000 0025 0000 3155` | Requires authentication (3D Secure) |
| `4000 0000 0000 9995` | Payment declined |
| `4000 0000 0000 9987` | Insufficient funds |

Test delivery speeds:
- Standard: Free shipping
- Express: $9.99
- Same Day: $19.99

### 6. Production Checklist
- [ ] Use live API keys
- [ ] Set up proper domain in Stripe Dashboard
- [ ] Enable Radar for fraud protection
- [ ] Configure payout settings
- [ ] Set up monitoring for webhook failures
- [ ] Implement logging for payment events
- [ ] Test end-to-end checkout flow

### 7. Error Handling
The system handles:
- Insufficient inventory
- Invalid coupons
- Payment failures
- Address validation
- Session expiration (24 hours)

### 8. Monitoring
Set up alerts for:
- Webhook failures
- Payment declines
- Inventory issues
- Coupon abuse
- High cart abandonment rates