import { Router } from 'express';
import Stripe from 'stripe';
import { protect, authorizeRoles } from '../middleware/auth';
import Subscription from '../models/Subscription';
import UsageEvent from '../models/UsageEvent';
import Invoice from '../models/Invoice';
import User from '../models/User';
import { StatusCodes } from 'http-status-codes';
import { cleanEnv, str } from 'envalid';

// Validate environment variables
const env = cleanEnv(process.env, {
  STRIPE_SECRET_KEY: str(),
  STRIPE_WEBHOOK_SECRET: str(),
});

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

const router = Router();

// Pricing configuration
const PRICING = {
  free: {
    priceId: process.env.STRIPE_PRICE_ID_FREE || '',
    features: ['basic_access', 'limited_api_calls'],
    monthlyApiCalls: 1000,
  },
  pro: {
    priceId: process.env.STRIPE_PRICE_ID_PRO || '',
    features: ['basic_access', 'unlimited_api_calls', 'priority_support'],
    monthlyApiCalls: Infinity,
  },
  enterprise: {
    priceId: process.env.STRIPE_PRICE_ID_ENTERPRISE || '',
    features: ['all_features', 'dedicated_support', 'custom_integrations'],
    monthlyApiCalls: Infinity,
  },
};

/**
 * GET /api/billing/pricing
 * Get pricing information for all plans
 */
router.get('/pricing', protect, async (req, res) => {
  try {
    // Get the current subscription for the user
    const subscription = await Subscription.findOne({ user_id: req.user.id });
    
    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        plans: [
          {
            name: 'Free',
            plan: 'free',
            price: 0,
            interval: 'month',
            features: PRICING.free.features,
            current: subscription?.plan === 'free',
            recommended: false,
          },
          {
            name: 'Pro',
            plan: 'pro',
            price: 29,
            interval: 'month',
            features: PRICING.pro.features,
            current: subscription?.plan === 'pro',
            recommended: true,
          },
          {
            name: 'Enterprise',
            plan: 'enterprise',
            price: 99,
            interval: 'month',
            features: PRICING.enterprise.features,
            current: subscription?.plan === 'enterprise',
            recommended: false,
          },
        ],
      },
    });
  } catch (error) {
    console.error('Error fetching pricing:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: 'Server error',
    });
  }
});

/**
 * POST /api/billing/checkout
 * Create a checkout session for plan selection
 */
router.post('/checkout', protect, async (req, res) => {
  try {
    const { plan } = req.body;
    
    // Validate plan
    if (!['free', 'pro', 'enterprise'].includes(plan)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        error: 'Invalid plan',
      });
    }
    
    // Get the user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        error: 'User not found',
      });
    }
    
    // Get the price ID for the selected plan
    const priceId = PRICING[plan as keyof typeof PRICING].priceId;
    if (!priceId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        error: 'Price ID not configured for this plan',
      });
    }
    
    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/billing?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/billing`,
      customer_email: user.email,
      metadata: {
        user_id: req.user.id,
        plan: plan,
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
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: 'Server error',
    });
  }
});

/**
 * GET /api/billing/portal
 * Create a billing portal session for managing subscription
 */
router.get('/portal', protect, async (req, res) => {
  try {
    // Get the user's subscription
    const subscription = await Subscription.findOne({ user_id: req.user.id });
    if (!subscription) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        error: 'No subscription found',
      });
    }
    
    // Get the user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        error: 'User not found',
      });
    }
    
    // Create a billing portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_sub_id.split('_')[0], // Extract customer ID from subscription ID
      return_url: `${process.env.CLIENT_URL}/billing`,
    });
    
    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        url: session.url,
      },
    });
  } catch (error) {
    console.error('Error creating billing portal session:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: 'Server error',
    });
  }
});

/**
 * GET /api/billing/usage
 * Get current usage for metered billing
 */
router.get('/usage', protect, async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Get API call usage for the current month
    const apiCalls = await UsageEvent.countDocuments({
      user_id: req.user.id,
      event_type: 'api_call',
      timestamp: { $gte: startOfMonth },
    });
    
    // Get storage usage for the current month
    const storage = await UsageEvent.aggregate([
      {
        $match: {
          user_id: req.user.id,
          event_type: 'storage',
          timestamp: { $gte: startOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$quantity' },
        },
      },
    ]);
    
    // Get seats usage (assuming one seat per user in organization)
    const seats = await User.countDocuments({
      organization_id: req.user.organization_id, // Assuming organization structure
    });
    
    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        api_calls: {
          current: apiCalls,
          limit: PRICING[req.user.plan as keyof typeof PRICING]?.monthlyApiCalls || 0,
          percentage: PRICING[req.user.plan as keyof typeof PRICING]?.monthlyApiCalls 
            ? (apiCalls / PRICING[req.user.plan as keyof typeof PRICING].monthlyApiCalls) * 100 
            : 0,
        },
        storage: {
          current: storage[0]?.total || 0,
          limit: req.user.plan === 'pro' ? 100 : req.user.plan === 'enterprise' ? 1000 : 10, // GB
          percentage: req.user.plan === 'pro' 
            ? ((storage[0]?.total || 0) / 100) * 100 
            : req.user.plan === 'enterprise'
            ? ((storage[0]?.total || 0) / 1000) * 100
            : ((storage[0]?.total || 0) / 10) * 100,
        },
        seats: {
          current: seats,
          limit: req.user.plan === 'pro' ? 5 : req.user.plan === 'enterprise' ? 25 : 1,
          percentage: req.user.plan === 'pro'
            ? (seats / 5) * 100
            : req.user.plan === 'enterprise'
            ? (seats / 25) * 100
            : (seats / 1) * 100,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching usage:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: 'Server error',
    });
  }
});

/**
 * POST /api/billing/usage
 * Report usage for metered billing
 */
router.post