import UsageEvent from '../models/UsageEvent';
import Subscription from '../models/Subscription';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

class UsageService {
  /**
   * Track usage event
   * @param userId - User ID
   * @param eventType - Type of usage event
   * @param quantity - Quantity of usage
   */
  static async trackUsage(userId: string, eventType: 'api_call' | 'storage' | 'seat', quantity: number): Promise<void> {
    try {
      // Create usage event record
      await UsageEvent.create({
        user_id: userId,
        event_type: eventType,
        quantity: quantity
      });
      
      // Report usage to Stripe for metered billing
      const subscription = await Subscription.findOne({ user_id: userId, status: 'active' });
      if (subscription) {
        // Find the subscription item for this usage type
        const subscriptionItems = await stripe.subscriptionItems.list({
          subscription: subscription.stripe_sub_id
        });
        
        const usageItem = subscriptionItems.data.find(item => 
          item.price.nickname?.toLowerCase() === eventType
        );
        
        if (usageItem) {
          await stripe.subscriptionItems.createUsageRecord(usageItem.id, {
            quantity: quantity,
            timestamp: Math.floor(Date.now() / 1000)
          });
        }
      }
    } catch (error) {
      console.error('Error tracking usage:', error);
      throw error;
    }
  }
  
  /**
   * Get usage statistics for a user
   * @param userId - User ID
   * @param eventType - Type of usage event
   * @param startDate - Start date for usage period
   * @param endDate - End date for usage period
   */
  static async getUsageStats(userId: string, eventType: 'api_call' | 'storage' | 'seat', startDate: Date, endDate: Date): Promise<{ total: number, daily: Array<{ date: string, count: number }> }> {
    try {
      const usageEvents = await UsageEvent.find({
        user_id: userId,
        event_type: eventType,
        timestamp: {
          $gte: startDate,
          $lte: endDate
        }
      }).sort('timestamp');
      
      const total = usageEvents.reduce((sum, event) => sum + event.quantity, 0);
      
      // Group by day
      const daily: Array<{ date: string, count: number }> = [];
      const dailyMap = new Map<string, number>();
      
      usageEvents.forEach(event => {
        const date = event.timestamp.toISOString().split('T')[0];
        dailyMap.set(date, (dailyMap.get(date) || 0) + event.quantity);
      });
      
      dailyMap.forEach((count, date) => {
        daily.push({ date, count });
      });
      
      return { total, daily: daily.sort((a, b) => a.date.localeCompare(b.date)) };
    } catch (error) {
      console.error('Error getting usage stats:', error);
      throw error;
    }
  }
}

export default UsageService;
```

```typescript