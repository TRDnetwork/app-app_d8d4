import Stripe from 'stripe';
import { cleanEnv, str } from 'envalid';

const env = cleanEnv(process.env, {
  STRIPE_SECRET_KEY: str(),
  STRIPE_WEBHOOK_SECRET: str(),
  STRIPE_SUCCESS_URL: str(),
  STRIPE_CANCEL_URL: str(),
  API_BASE_URL: str(),
});

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export const createCheckoutSession = async (orderData: any) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: orderData.items.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.product_title,
          images: [item.image_url],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    })),
    mode: 'payment',
    success_url: env.STRIPE_SUCCESS_URL + '?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: env.STRIPE_CANCEL_URL,
    metadata: {
      orderId: orderData.orderId,
      userId: orderData.userId,
    },
  });

  return session;
};

export const verifyWebhookSignature = (payload: Buffer, signature: string) => {
  try {
    return stripe.webhooks.constructEvent(payload, signature, env.STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return null;
  }
};

export const getPaymentStatus = async (sessionId: string) => {
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  return session;
};