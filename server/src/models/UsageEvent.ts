import { Schema, model, Document } from 'mongoose';

export interface IUsageEvent extends Document {
  user_id: string;
  event_type: 'api_call' | 'storage' | 'seat';
  quantity: number;
  timestamp: Date;
}

const usageEventSchema = new Schema<IUsageEvent>({
  user_id: {
    type: String,
    required: true,
    index: true
  },
  event_type: {
    type: String,
    enum: ['api_call', 'storage', 'seat'],
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Compound index for efficient querying
usageEventSchema.index({ user_id: 1, event_type: 1, timestamp: -1 });

export default model<IUsageEvent>('UsageEvent', usageEventSchema);
```

```typescript