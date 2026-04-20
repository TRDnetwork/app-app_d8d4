const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');

/**
 * Creates a Stripe Checkout Session for the user's cart
 * @param {string} userId - The ID of the user
 * @param {string} successUrl - The URL to redirect to after successful payment
 * @param {string} cancelUrl - The URL to redirect to after cancelled payment
 * @returns {Promise<Object>} - The Stripe session object
 */
async function createCheckoutSession(userId, successUrl, cancelUrl) {
  try {
    // Find user with default address
    const user = await User.findById(userId).populate('addresses');
    if (!user) {
      throw new Error('User not found');
    }

    const defaultAddress = user.addresses?.find(addr => addr.is_default);
    if (!defaultAddress) {
      throw new Error('No default address found');
    }

    // Get cart with populated products
    const cart = await Cart.findOne({ user_id: userId }).populate({
      path: 'items.product_id',
      model: 'Product'
    });

    if (!cart || cart.items.length === 0) {
      throw new Error('Cart is empty');
    }

    // Calculate order totals
    let subtotal = 0;
    const lineItems = [];

    for (const item of cart.items) {
      const product = item.product_id;
      const price = product.price * (1 - product.discount_percent / 100);
      const lineTotal = price * item.quantity;
      
      subtotal += lineTotal;

      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.title,
            images: product.images.slice(0, 1),
          },
          unit_amount: Math.round(price * 100), // Stripe expects cents
        },
        quantity: item.quantity,
      });
    }

    const shippingCost = subtotal > 50 ? 0 : 9.99;
    const tax = Math.round(subtotal * 0.08); // 8% tax
    const total = Math.round((subtotal + shippingCost + tax) * 100); // in cents

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: user.email,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU', 'IN'], // Expand as needed
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: shippingCost * 100, currency: 'usd' },
            display_name: 'Standard shipping',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 5 },
              maximum: { unit: 'business_day', value: 7 },
            },
          },
        },
      ],
      metadata: {
        userId: userId,
        addressId: defaultAddress._id.toString(),
        subtotal: subtotal.toFixed(2),
        shipping: shippingCost.toFixed(2),
        tax: (tax / 100).toFixed(2),
      },
      line_items: lineItems,
    });

    return session;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

/**
 * Handles Stripe webhook events
 * @param {Object} event - The Stripe event object
 */
async function handleWebhook(event) {
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      await _handleCheckoutSessionCompleted(session);
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
}

/**
 * Handles the checkout.session.completed event by creating an order
 * @param {Object} session - The Stripe session object
 * @private
 */
async function _handleCheckoutSessionCompleted(session) {
  const userId = session.metadata.userId;
  const addressId = session.metadata.addressId;
  const subtotal = parseFloat(session.metadata.subtotal);
  const shipping = parseFloat(session.metadata.shipping);
  const tax = parseFloat(session.metadata.tax);

  // Get cart items
  const cart = await Cart.findOne({ user_id: userId }).populate({
    path: 'items.product_id',
    model: 'Product'
  });

  if (!cart || cart.items.length === 0) {
    throw new Error('Cannot create order from empty cart');
  }

  // Create order items array
  const orderItems = cart.items.map(item => ({
    product_id: item.product_id._id,
    quantity: item.quantity,
    price_at_purchase: item.product_id.price * (1 - item.product_id.discount_percent / 100)
  }));

  // Calculate total
  const total = subtotal + shipping + tax;

  // Create order in database
  const order = new Order({
    user_id: userId,
    items: orderItems,
    subtotal,
    tax,
    shipping_cost: shipping,
    total,
    address_id: addressId,
    payment_method: 'card',
    payment_status: 'succeeded',
    order_status: 'placed',
    stripe_payment_intent_id: session.payment_intent,
    created_at: new Date(session.created * 1000)
  });

  await order.save();

  // Clear the cart
  await Cart.findOneAndUpdate(
    { user_id: userId },
    { items: [], updated_at: new Date() }
  );

  // Update product stock
  for (const item of cart.items) {
    await Product.findByIdAndUpdate(
      item.product_id._id,
      { $inc: { stock: -item.quantity } }
    );
  }

  console.log(`Order ${order._id} created successfully for user ${userId}`);
}

module.exports = {
  createCheckoutSession,
  handleWebhook
};