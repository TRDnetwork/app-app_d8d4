import { Schema, model, models } from 'mongoose';

const UsageEventSchema = new Schema({
  user_id: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true
  },
  event_type: { 
    type: String, 
    enum: ['workout_log', 'workout_plan', 'api_call', 'storage_gb'], 
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
}, {
  timestamps: false,
  collection: 'usage_events'
});

// Create compound index for efficient querying
UsageEventSchema.index({ user_id: 1, event_type: 1, timestamp: -1 });

// Limit the size of the usage_events collection to prevent performance issues
UsageEventSchema.index({ timestamp: 1 }, { expireAfterSeconds: 31536000 }); // 1 year TTL

export const UsageEvent = models.UsageEvent || model('UsageEvent', UsageEventSchema);
```

```typescript