import { Schema, model, models } from 'mongoose';

const subscriptionSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    stripe_sub_id: {
      type: String,
      required: true,
      unique: true,
    },
    plan: {
      type: String,
      enum: ['free', 'pro', 'enterprise'],
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'canceled', 'past_due', 'unpaid', 'incomplete', 'incomplete_expired'],
      default: 'active',
    },
    current_period_end: {
      type: Date,
      required: true,
    },
    trial_end: {
      type: Date,
    },
    cancel_at_period_end: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: 'app_d8d4_subscriptions',
  }
);

// Create indexes for frequently queried fields
subscriptionSchema.index({ user_id: 1 });
subscriptionSchema.index({ stripe_sub_id: 1 }, { unique: true });
subscriptionSchema.index({ status: 1 });
subscriptionSchema.index({ current_period_end: 1 });

export default models.Subscription || model('Subscription', subscriptionSchema);
```

```typescript