# ShopSphere Payment Integration Setup

## Stripe Configuration

### 1. Environment Variables
Add these variables to your `.env` file:

```env
# Stripe API Keys
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Application URLs
FRONTEND_URL=https://shopsphere.com
BACKEND_URL=https://api.shopsphere.com
```

### 2. Webhook Setup
1. Install Stripe CLI: `npm install -g stripe-cli`
2. Login: `stripe login`
3. Create webhook endpoint:
   ```bash
   stripe listen --forward-to localhost:5000/api/payment/webhook
   ```
4. Copy the webhook secret and add it to `.env` as `STRIPE_WEBHOOK_SECRET`
5. In Stripe Dashboard, add the webhook endpoint:
   - URL: `https://api.shopsphere.com/api/payment/webhook`
   - Events: `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`

### 3. Test Cards
Use these test card numbers for development:

| Card Type | Number | Result |
|-----------|-------|--------|
| Success | `4242 4242 4242 4242` | Payment succeeds |
| Decline | `4000 0000 0000 0002` | Payment declines |
| 3D Secure | `4000 0025 0000 3155` | Requires authentication |

### 4. Required Stripe Dashboard Settings
1. **Account Settings**: Enable required business information
2. **Webhooks**: Add the production webhook endpoint
3. **Payment Methods**: Enable Card payments
4. **Radar**: Configure basic fraud rules

## Backend Integration

### API Endpoints
- `POST /api/payment/create-checkout-session` - Create Stripe Checkout session
- `POST /api/payment/webhook` - Handle Stripe webhook events
- `GET /api/payment/order-details?session_id=...` - Get order details

### Error Handling
The payment system handles these common errors:
- Invalid cart state
- Missing address or delivery method
- Payment processing failures
- Webhook signature verification failures

## Frontend Integration

### Checkout Flow
1. Address selection from user's saved addresses
2. Delivery method selection (Standard, Express, Same-day)
3. Payment method (credit/debit card via Stripe)
4. Order review and confirmation

### Order Confirmation
After successful payment, users are redirected to `/order-confirmation?session_id={CHECKOUT_SESSION_ID}` where they can view:
- Order number
- Order summary
- Estimated delivery date
- Next steps

## Security Considerations
- All sensitive operations occur server-side
- Webhook signatures are verified
- No API keys are exposed to client-side code
- HTTPS is required in production
- Input validation on all endpoints

## Testing
1. Use test mode with test API keys
2. Verify webhook handling with Stripe CLI
3. Test edge cases:
   - Empty cart
   - Invalid addresses
   - Payment failures
   - Session expiration

## Production Deployment
1. Replace test API keys with live keys
2. Update webhook endpoint to production URL
3. Enable monitoring for payment failures
4. Set up alerts for webhook delivery failures