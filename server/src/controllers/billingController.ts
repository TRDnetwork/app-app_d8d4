import { Request, Response } from 'express';
import Stripe from 'stripe';
import { Subscription } from '../models/Subscription';
import { UsageEvent } from '../models/UsageEvent';
import { Invoice } from '../models/Invoice';
import { User } from '../models/User';
import { StatusCodes } from 'http-status-codes';
import { logger } from '../utils/logger';
import { config } from '../config/env';

// Initialize Stripe with environment variable
const stripe = new Stripe(config.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

// Pricing plans configuration
const PRICING_PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    features: ['Basic features', 'Limited usage'],
    stripePriceId: null,
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 29,
    features: ['All features', 'Unlimited usage', 'Priority support'],
    stripePriceId: config.STRIPE_PRO_PRICE_ID,
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99,
    features: ['All features', 'Unlimited usage', 'Dedicated support', 'Custom integrations'],
    stripePriceId: config.STRIPE_ENTERPRISE_PRICE_ID,
  },
};

// Get pricing plans
export const getPricingPlans = async (req: Request, res: Response) => {
  try {
    res.status(StatusCodes.OK).json({
      success: true,
      data: Object.values(PRICING_PLANS),
    });
  } catch (error: any) {
    logger.error('Error getting pricing plans:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to get pricing plans',
    });
  }
};

// Create Stripe Checkout Session for subscription
export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const { planId, successUrl, cancelUrl } = req.body;
    const userId = (req as any).user.id;

    // Validate plan
    const plan = PRICING_PLANS[planId as keyof typeof PRICING_PLANS];
    if (!plan || !plan.stripePriceId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid plan selected',
      });
    }

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'User not found',
      });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: plan.stripePriceId,
          quantity: 1,
        },
      ],
      customer_email: user.email,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId: userId,
        planId: planId,
      },
      allow_promotion_codes: true,
    });

    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        sessionId: session.id,
        url: session.url,
      },
    });
  } catch (error: any) {
    logger.error('Error creating checkout session:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to create checkout session',
    });
  }
};

// Handle Stripe webhook events
export const handleWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig!,
      config.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    logger.error('Webhook signature verification failed:', err.message);
    return res.status(StatusCodes.BAD_REQUEST).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'invoice.paid':