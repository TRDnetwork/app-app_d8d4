import Subscription from '../models/Subscription';
import { sendEmail } from '../utils/sendEmail';

class TrialService {
  /**
   * Check if trial is expiring soon and send warning emails
   */
  static async checkExpiringTrials(): Promise<void> {
    try {
      // Find subscriptions with trial ending in the next 3 days
      const soonExpiring = await Subscription.find({
        status: 'trialing',
        current