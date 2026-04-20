import { Schema, model, models } from 'mongoose';

const usageEventSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    event_type: {
      type: String,
      required: true,
      enum: ['api_call', 'storage', 'seats'],
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    collection: 'app_d8d4_usage_events',
  }
);

// Create indexes for frequently queried fields
usageEventSchema.index({ user_id: 1 });
usageEventSchema.index({ event_type: 1 });
usageEventSchema.index({ timestamp: 1 });

// Cap the collection size to prevent unbounded growth
usageEventSchema.index({ timestamp: 1 }, { expireAfterSeconds: 2592000 }); // 30 days

export default models.UsageEvent || model('UsageEvent', usageEventSchema);
```

```typescript