import mongoose, { Document, Schema } from 'mongoose';

// Interface for subscription document
export interface ISubscription extends Document {
  userId: string;
  stripeSubId: string;
  plan: string;
  status: string;
  currentPeriodEnd: Date;
}

// Schema definition
const subscriptionSchema = new Schema<ISubscription>({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  stripeSubId: {
    type: String,
    required: true,
    unique: true,
  },
  plan: {
    type: String,
    required: true,
    enum: ['free', 'pro', 'enterprise'],
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'unpaid', 'paused'],
    default: 'active',
  },
  currentPeriodEnd: {
    type: Date,
    required: true,
  },
}, {
  timestamps: true,
});

// Create and export the model
const Subscription = mongoose.model<ISubscription>('Subscription', subscriptionSchema);
export default Subscription;
```

```typescript