import mongoose, { Document, Schema } from 'mongoose';

export interface IJob extends Document {
  type: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  data: Record<string, any>;
  result?: Record<string, any>;
  error?: string;
  progress: number;
  retries: number;
  maxRetries: number;
  createdAt: Date;
  updatedAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}

const jobSchema = new Schema<IJob>({
  type: {
    type: String,
    required: true,
    enum: ['import', 'export', 'data-cleanup', 'analytics', 'email']
  },
  status: {
    type: String,
    enum: ['pending', 'running', 'completed', 'failed'],
    default: 'pending'
  },
  data: {
    type: Schema.Types.Mixed,
    required: true
  },
  result: {
    type: Schema.Types.Mixed
  },
  error: {
    type: String
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  retries: {
    type: Number,
    default: 0,
    min: 0
  },
  maxRetries: {
    type: Number,
    default: 3,
    min: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  startedAt: {
    type: Date
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for better query performance
jobSchema.index({ type: 1, status: 1 });
jobSchema.index({ createdAt: -1 });
jobSchema.index({ status: 1, createdAt: 1 });

export default mongoose.model<IJob>('Job', jobSchema);
```
```typescript