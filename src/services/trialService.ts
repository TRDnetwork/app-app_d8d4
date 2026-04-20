import { db } from '../lib/database';
import { PlanType } from '../types/billing';
import { sendEmail } from './emailService';

/**
 * Trial management service
 */
class TrialService {
  private readonly TRIAL_DURATION_DAYS = 14;
  private readonly WARNING_DAYS_BEFORE_EXPIRY = 3;

  /**
   * Start a free trial for a user
   */
  async startTrial(userId: string): Promise<void> {
    // Check if user already has an active subscription
    const existingSubscription = await db.subscriptions.findByUserId(userId);
    if (existingSubscription && existingSubscription.status === 'active') {
      throw new Error('User already has an active subscription');
    }

    // Create trial subscription
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + this.TRIAL_DURATION_DAYS);

    const subscription = {
      id: `sub_trial_${Date.now()}`,
      userId,
      stripeSubId: '', // Will be set when they subscribe after trial
      plan: PlanType.PRO,
      status: 'trialing',
      currentPeriodEnd: trialEndDate,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.subscriptions.create(subscription);

    // Send welcome email with trial information
    await sendEmail({
      to: await this.getUserEmail(userId),
      template: 'trial_started',
      data: {
        trialEndDate: trialEndDate.toLocaleDateString(),
        days: this.TRIAL_DURATION_DAYS,
      },
    });
  }

  /**
   * Check if a user's trial is expiring soon
   */
  async checkTrialExpiry(): Promise<void> {
    const now = new Date();
    const warningDate = new Date();
    warningDate.setDate(now.getDate() + this.WARNING_DAYS_BEFORE_EXPIRY);

    // Find all active trials that will expire in the next few days
    const trials = await this.getActiveTrialsExpiringSoon(warningDate);

    // Send warning emails
    for (const trial of trials) {
      await this.sendTrialExpiryWarning(trial);
    }
  }

  /**
   * Get active trials expiring before a certain date
   */
  private async getActiveTrialsExpiringSoon(expiryDate: Date): Promise<any[]> {
    const trials: any[] = [];
    for (const subscription of storage.subscriptions.values()) {
      if (
        subscription.plan === PlanType.PRO &&
        subscription.status === 'trialing' &&
        subscription.currentPeriodEnd <= expiryDate
      ) {
        trials.push(subscription);
      }
    }
    return trials;
  }

  /**
   * Send trial expiry warning email
   */
  private async sendTrialExpiryWarning(subscription: any): Promise<void> {
    const daysUntilExpiry = Math.ceil(
      (subscription.currentPeriodEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );

    await sendEmail({
      to: await this.getUserEmail(subscription.userId),
      template: 'trial_expiring',
      data: {
        daysUntilExpiry,
        expiryDate: subscription.currentPeriodEnd.toLocaleDateString(),
      },
    });
  }

  /**
   * Auto-convert trial to paid subscription or downgrade to free
   */
  async handleTrialExpiry(): Promise<void> {
    const now = new Date();

    // Find all trials that have expired
    const expiredTrials = await this.getExpiredTrials(now);

    for (const trial of expiredTrials) {
      await this.convertTrial(trial);
    }
  }

  /**
   * Get expired trials
   */
  private async getExpiredTrials(now: Date): Promise<any[]> {
    const expired: any[] = [];
    for (const subscription of storage.subscriptions.values()) {
      if (
        subscription.plan === PlanType.PRO &&
        subscription.status === 'trialing' &&
        subscription.currentPeriodEnd <= now
      ) {
        expired.push(subscription);
      }
    }
    return expired;
  }

  /**
   * Convert a trial to paid subscription or downgrade to free
   */
  private async convertTrial(trial: any): Promise<void> {
    // In a real implementation, we would check if the user has provided payment info
    // For now, we'll assume they haven't and downgrade to free
    await db.subscriptions.update(trial.id, {
      plan: PlanType.FREE,
      status: 'active',
      updatedAt: new Date(),
    });

    // Send email about trial ending
    await sendEmail({
      to: await this.getUserEmail(trial.userId),
      template: 'trial_ended',
      data: {
        plan: 'Free',
      },
    });
  }

  /**
   * Extend trial for engaged users
   */
  async extendTrial(userId: string, days: number): Promise<void> {
    const subscription = await db.subscriptions.findByUserId(userId);
    if (!subscription || subscription.plan !== PlanType.PRO || subscription.status !== 'trialing') {
      throw new Error('User does not have an active trial');
    }

    // Extend trial period
    const newExpiry = new Date(subscription.currentPeriodEnd);
    newExpiry.setDate(newExpiry.getDate() + days);

    await db.subscriptions.update(subscription.id, {
      currentPeriodEnd: newExpiry,
      updatedAt: new Date(),
    });

    // Send email about trial extension
    await sendEmail({
      to: await this.getUserEmail(userId),
      template: 'trial_extended',
      data: {
        newExpiryDate: newExpiry.toLocaleDateString(),
        additionalDays: days,
      },
    });
  }

  /**
   * Get user email
   */
  private async getUserEmail(userId: string): Promise<string> {
    const user = await db.users.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user.email;
  }
}

export default new TrialService();
```

```typescript