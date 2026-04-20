import { Request, Response } from 'express';
import Subscription from '../models/Subscription';
import UsageEvent from '../models/UsageEvent';
import Invoice from '../models/Invoice';

/**
 * GET /api/billing/subscription
 * Get the current user's subscription
 */
export const getSubscription = async (req: Request, res: Response) => {
  try {
    const subscription = await Subscription.findOne({ userId: req.user.id });
    
    if (!subscription) {
      return res.status(404).json({
        message: 'No subscription found',
      });
    }
    
    res.json({ subscription });
  } catch (error: any) {
    console.error('Error getting subscription:', error);
    res.status(500).json({
      error: 'Failed to get subscription',
      message: error.message,
    });
  }
};

/**
 * GET /api/billing/usage
 * Get the user's usage events
 */
export const getUsageEvents = async (req: Request, res: Response) => {
  try {
    const { eventType, startDate, endDate } = req.query;
    
    // Build query
    const query: any = { userId: req.user.id };
    
    if (eventType) {
      query.eventType = eventType;
    }
    
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) {
        query.timestamp.$gte = new Date(startDate as string);
      }
      if (endDate) {
        query.timestamp.$lte = new Date(endDate as string);
      }
    }
    
    const usageEvents = await UsageEvent.find(query)
      .sort({ timestamp: -1 })
      .limit(50);
    
    res.json({ usageEvents });
  } catch (error: any) {
    console.error('Error getting usage events:', error);
    res.status(500).json({
      error: 'Failed to get usage events',
      message: error.message,
    });
  }
};

/**
 * GET /api/billing/invoices
 * Get the user's invoices
 */
export const getInvoices = async (req: Request, res: Response) => {
  try {
    const { status, startDate, endDate } = req.query;
    
    // Build query
    const query: any = { userId: req.user.id };
    
    if (status) {
      query.status = status;
    }
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate as string);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate as string);
      }
    }
    
    const invoices = await Invoice.find(query)
      .sort({ createdAt: -1 });
    
    res.json({ invoices });
  } catch (error: any) {
    console.error('Error getting invoices:', error);
    res.status(500).json({
      error: 'Failed to get invoices',
      message: error.message,
    });
  }
};
```

```typescript