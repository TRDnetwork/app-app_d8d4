import { stripe } from '../../server/src/services/stripe';
import { db } from '../../server/src/services/database';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { cartItems, address, deliverySpeed, couponCode } = req.body;
  const userId = req.user?.id; // Assuming auth middleware adds user to req

  if (!userId || !cartItems || !address) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Verify inventory
    const productIds = cartItems.map(item => item.productId);
    const products = await db.collection('app_d8d4_products').find({ _id: { $in: productIds.map(id => db.ObjectId(id)) } }).toArray();

    const lineItems = cartItems.map(item => {
      const product = products.find(p => p._id.toString() === item.productId);
      if (!product || product.stock_quantity < item.quantity) {
        throw new Error(`Insufficient stock for ${product?.title}`);
      }
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.title,
            images: [product.images[0]],
          },
          unit_amount: Math.round(product.price * 100), // Stripe expects cents
        },
        quantity: item.quantity,
      };
    });

    // Calculate delivery price
    const deliveryPrices = {
      standard: 0,
      express: 999, // cents
      same_day: 1999, // cents
    };
    const deliveryPrice = deliveryPrices[deliverySpeed] || 0;

    // Apply coupon if valid
    let discount = 0;
    if (couponCode) {
      const coupon = await db.collection('app_d8d4_coupons').findOne({
        code: couponCode.toUpperCase(),
        is_active: true,
        valid_from: { $lte: new Date() },
        valid_until: { $gte: new Date() },
        used_count: { $lt: '$usage_limit' },
      });

      if (coupon) {
        const subtotal = lineItems.reduce((sum, item) => sum + (item.price_data.unit_amount * item.quantity), 0);
        if (subtotal >= coupon.min_order_value) {
          if (coupon.type === 'percentage') {
            discount = Math.min(
              Math.round(subtotal * (coupon.value / 100)),
              coupon.max_discount ? coupon.max_discount * 100 : Infinity
            );
          } else {
            discount = coupon.value * 100;
          }
        }
      }
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: lineItems,
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: deliveryPrice, currency: 'usd' },
            display_name: deliverySpeed === 'standard' ? 'Standard Delivery' : deliverySpeed === 'express' ? 'Express Delivery' : 'Same Day Delivery',
          },
        },
      ],
      metadata: {
        userId,
        address: JSON.stringify(address),
        deliverySpeed,
        couponCode: couponCode || '',
        discountAmount: discount,
      },
      success_url: `${process.env.FRONTEND_URL}/order-confirmation/{CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout`,
    });

    // Store session in database for webhook verification
    await db.collection('app_d8d4_checkout_sessions').insertOne({
      sessionId: session.id,
      userId,
      cartItems,
      address,
      deliverySpeed,
      couponCode,
      discountAmount: discount,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
}