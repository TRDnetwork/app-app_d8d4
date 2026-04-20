import mongoose, { Document, Schema } from 'mongoose';

export interface ISellerAnalytics extends Document {
  sellerId: mongoose.Types.ObjectId;
  date: Date;
  revenue: number;
  ordersCount: number;
  refundsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const SellerAnalyticsSchema = new Schema<ISellerAnalytics>(
  {
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    revenue: {
      type: Number,
      required: true,
      min: [0, 'Revenue cannot be negative'],
      default: 0,
    },
    ordersCount: {
      type: Number,
      required: true,
      min: [0, 'Orders count cannot be negative'],
      default: 0,
    },
    refundsCount: {
      type: Number,
      required: true,
      min: [0, 'Refunds count cannot be negative'],
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for seller and date (daily analytics)
SellerAnalyticsSchema.index({ sellerId: 1, date: 1 }, { unique: true });

export default mongoose.model<ISellerAnalytics>('SellerAnalytics', SellerAnalyticsSchema);