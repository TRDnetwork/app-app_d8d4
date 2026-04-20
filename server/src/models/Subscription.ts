import { Schema, model, Document } from 'mongoose';

export interface ISubscription extends Document {
  user_id: string;
  stripe_sub_id: string;
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'canceled' | 'past_due' | 'unpaid';
  current_period_end: Date;
  created_at: Date;
  updated_at: Date;
}

const subscriptionSchema = new Schema<ISubscription>({
  user_id: {
    type: String,
    required: true,
    index: true
  },
  stripe_sub_id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  plan: {
    type: String,
    enum: ['free', 'pro', 'enterprise'],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'canceled', 'past_due', 'unpaid'],
    default: 'active'
  },
  current_period_end: {
    type: Date,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Ensure TTL index for subscription cleanup
subscriptionSchema.index({ current_period_end: 1 }, { expireAfterSeconds: 0 });

export default model<ISubscription>('Subscription', subscriptionSchema);
```

```typescript