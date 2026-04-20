import { Schema, model, models } from 'mongoose';

const SubscriptionSchema = new Schema({
  user_id: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
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
    default: 'free' 
  },
  status: { 
    type: String, 
    enum: ['active', 'canceled', 'past_due', 'unpaid', 'trialing'], 
    default: 'active' 
  },
  current_period_end: { 
    type: Date 
  }
}, {
  timestamps: true,
  collection: 'subscriptions'
});

// Create TTL index to automatically remove expired subscriptions after 30 days
SubscriptionSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 }); // 30 days

export const Subscription = models.Subscription || model('Subscription', SubscriptionSchema);
```

```typescript