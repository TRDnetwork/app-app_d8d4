import stripe from '../config/stripe';
import { Request, Response } from 'express';
import { verifyStripeWebhook, sanitizePath } from '../middleware/security';
import { Order } from '../models/order';
import { Product } from '../models/product';
import { User } from '../models/user';
import { validate } from '../utils/validator';

// Create checkout session
export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validationRules = {
      items: 'required|array',
      items.*.product_id: 'required|string',
      items.*.quantity: 'required|integer|min:1',
      address: 'required|object',
      deliverySpeed: 'required|string|in:standard,express,same_day',
      couponCode: 'optional|string',
    };
    
    const errors = validate(req.body, validationRules);
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }
    
    const { items, address, deliverySpeed, couponCode } = req.body;
    
    // Validate user is authenticated
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Validate products and calculate total
    let lineItems = [];
    let orderItems = [];
    let subtotal = 0;
    
    for (const item of items) {
      const product = await Product.findById(item.product_id);
      if (!product) {
        return res.status(404).json({ error: `Product ${item.product_id} not found` });
      }
      
      if (product.stock_quantity < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${product.title}` });
      }
      
      const price = product.price;
      const lineTotal = price * item.quantity;
      subtotal += lineTotal;
      
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.title,
            images: [product.images[0]],
          },
          unit_amount: Math.round(price * 100), // Convert to cents
        },
        quantity: item.quantity,
      });
      
      orderItems.push({
        product_id: product._id,
        seller_id: product.seller_id,
        title: product.title,
        price: price,
        quantity: item.quantity,
        status: 'placed',
      });
    }
    
    // Apply coupon if provided
    let discount = 0;
    let coupon = null;
    if (couponCode) {
      coupon = await Coupon.findOne({ 
        code: couponCode, 
        is_active: true,
        valid_from: { $lte: new Date() },
        valid_until: { $gte: new Date() },
        used_count: { $lt: '$usage_limit' }
      });
      
      if (coupon) {
        if (subtotal >= coupon.min_order_value) {
          if (coupon.type === 'percentage') {
            discount = Math.min(
              (subtotal * coupon.value) / 100,
              coupon.max_discount || subtotal
            );
          } else if (coupon.type === 'fixed') {
            discount = Math.min(coupon.value, subtotal);
          }
        }
      }
    }
    
    // Calculate delivery charge
    const deliveryCharge = deliverySpeed === 'standard' ? 0 : 
                          deliverySpeed === 'express' ? 9.99 : 19.99;
    
    const total = Math.max(0, subtotal - discount + deliveryCharge);
    
    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cart`,
      customer_email: req.user.email,
      metadata: {
        user_id: req.user._id.toString(),
        delivery_speed: deliverySpeed,
        address: JSON.stringify(address),
        coupon_code: couponCode || '',
        subtotal: subtotal.toFixed(2),
        discount: discount.toFixed(2),
        delivery_charge: deliveryCharge.toFixed(2),
        total: total.toFixed(2),
      },
    });
    
    res.json({ sessionId: session.id });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
};

// Handle Stripe webhook
export const handleWebhook = [
  // First, parse the raw body for webhook signature verification
  (req: Request, res: Response, next: NextFunction) => {
    req.rawBody = '';
    req.setEncoding('utf8');
    req.on('data', (chunk) => {
      req.rawBody += chunk;
    });
    req.on('end', () => {
      next();
    });
  },
  
  // Verify webhook signature
  verifyStripeWebhook,
  
  // Process the webhook event
  async (req: Request, res: Response) => {
    try {
      const event = req.stripeEvent;
      
      // Handle different event types
      switch (event.type) {
        case 'checkout.session.completed':
          const session = event.data.object;
          
          // Prevent replay attacks by checking if session already processed
          const existingOrder = await Order.findOne({ stripe_session_id: session.id });
          if (existingOrder) {
            console.log(`Session ${session.id} already processed`);
            return res.json({ received: true });
          }
          
          // Extract metadata
          const metadata = session.metadata;
          const userId = metadata.user_id;
          const deliverySpeed = metadata.delivery_speed;
          const address = JSON.parse(metadata.address);
          const couponCode = metadata.coupon_code;
          const subtotal = parseFloat(metadata.subtotal);
          const discount = parseFloat(metadata.discount);
          const deliveryCharge = parseFloat(metadata.delivery_charge);
          const total = parseFloat(metadata.total);
          
          // Get user
          const user = await User.findById(userId);
          if (!user) {
            console.error(`User ${userId} not found`);
            return res.status(404).json({ error: 'User not found' });
          }
          
          // Create order
          const order = new Order({
            user_id: userId,
            order_number: `ORD-${Date.now()}`,
            items: session.metadata.items, // This would be stored in a separate process
            address: address,
            delivery_speed: deliverySpeed,
            payment_method: 'stripe',
            payment_status: 'completed',
            stripe_session_id: session.id,
            stripe_payment_intent_id: session.payment_intent,
            subtotal: subtotal,
            discount: discount,
            coupon_code: couponCode,
            delivery_charge: deliveryCharge,
            total: total,
            status: 'placed',
            created_at: new Date(),
          });
          
          await order.save();
          
          // Update coupon usage if applicable
          if (couponCode) {
            await Coupon.updateOne(
              { code: couponCode },
              { $inc: { used_count: 1 } }
            );
          }
          
          // Send order confirmation email
          await sendOrderConfirmationEmail(user.email, order);
          
          break;
          
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object;
          console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
          break;
          
        case 'payment_intent.payment_failed':
          const failedPaymentIntent = event.data.object;
          console.log(`Payment failed: ${failedPaymentIntent.last_payment_error?.message}`);
          break;
          
        default:
          console.log(`Unhandled event type ${event.type}`);
      }
      
      // Return 200 to acknowledge receipt
      res.json({ received: true });
    } catch (error: any) {
      console.error('Error processing webhook:', error);
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  }
];
```

```typescript