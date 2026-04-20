import { Request, Response, NextFunction } from 'express';

/**
 * Verify Stripe webhook signature
 */
export const verifyStripeWebhook = (req: Request, res: Response, next: NextFunction) => {
  const signature = req.headers['stripe-signature'];
  
  if (!signature) {
    return res.status(400).send('Missing Stripe signature');
  }
  
  try {
    // In a real implementation, you would verify the signature using Stripe's library
    // For now, we'll just pass through in development
    // In production, uncomment the following code:
    
    /*
    const event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    
    // Add the event to the request object
    (req as any).stripeEvent = event;
    */
    
    next();
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
};
```

```typescript