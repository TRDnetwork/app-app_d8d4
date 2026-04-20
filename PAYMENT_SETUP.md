# ShopSphere Payment Integration Setup

## Stripe Configuration

### 1. Environment Variables
Add the following to your `.env` file:

```env
# Stripe API Keys
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Frontend URL for redirects
FRONTEND_URL=http://localhost:3000
```

### 2. Webhook Setup
1. Install Stripe CLI: `npm install -g stripe-cli`
2. Login: `stripe login`
3. Start webhook forwarding:
```bash
stripe listen --forward-to localhost:5000/api/stripe/webhook
```
4. Copy the webhook signing secret and add it to `.env` as `STRIPE_WEBHOOK_SECRET`

### 3. Payment Flow
1. **Checkout Session Creation**:
   - POST `/api/stripe/create-checkout-session`
   - Requires authentication
   - Expects: `{ deliverySpeed, addressId }`
   - Returns: `{ sessionId }`

2. **Webhook Events**:
   - `checkout.session.completed`: Payment succeeded
   - `payment_intent.payment_failed`: Payment failed
   - Updates order status accordingly

### 4. Frontend Integration
1. Load Stripe.js in `index.html`:
```html
<script src="https://js.stripe.com/v3/"></script>
```

2. Use in components:
```javascript
const stripe = Stripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
```

### 5. Testing
Use Stripe test cards:
- Successful payment: `4242 4242 4242 4242`
- Requires SCA: `4000 0025 0000 3155`
- Declined: `4000 0000 0000 0002`

### 6. Production Deployment
1. Replace test keys with live keys
2. Update webhook URL in Stripe Dashboard
3. Enable monitoring for:
   - Failed webhook deliveries
   - High payment failure rates
   - Unusual transaction patterns

### 7. Security
- Webhook signature verification is enforced
- Idempotency keys prevent duplicate processing
- All API keys stored in environment variables
- HTTPS required in production

### 8. Error Handling
Common errors and solutions:
- `401 Unauthorized`: User not authenticated
- `400 Bad Request`: Invalid address or empty cart
- `500 Server Error`: Check server logs for details
- Webhook verification failed: Verify `STRIPE_WEBHOOK_SECRET`