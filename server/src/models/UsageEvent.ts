import mongoose, { Document, Schema } from 'mongoose';

// Interface for usage event document
export interface IUsageEvent extends Document {
  userId: string;
  eventType: string;
  quantity: number;
  timestamp: Date;
}

// Schema definition
const usageEventSchema = new Schema<IUsageEvent>({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  eventType: {
    type: String,
    required: true,
    index: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
    index: true,
  },
}, {
  timestamps: false,
});

// Create and export the model
const UsageEvent = mongoose.model<IUsageEvent>('UsageEvent', usageEventSchema);
export default UsageEvent;
```

```typescript