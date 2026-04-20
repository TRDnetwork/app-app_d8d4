// This file is generated as part of the backend implementation
// It defines the Mongoose schema for app_d8d4_coupons collection

import mongoose, { Document, Schema } from 'mongoose';

export interface ICoupon extends Document {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  min_order_value: number;
  max_discount?: number;
  usage_limit?: number;
  used_count: number;
  valid_from: Date;
  valid_until: Date;
  is_active: boolean;
  created_at: Date;
}

const CouponSchema: Schema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: true,
    },
    value: {
      type: Number,
      required: true,
      min: 0,
    },
    min_order_value: {
      type: Number,
      required: true,
      min: 0,
    },
    max_discount: {
      type: Number,
      min: 0,
    },
    usage_limit: {
      type: Number,
      min: 1,
    },
    used_count: {
      type: Number,
      default: 0,
      min: 0,
    },
    valid_from: {
      type: Date,
      required: true,
    },
    valid_until: {
      type: Date,
      required: true,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: { createdAt: 'created_at' },
  }
);

// Indexes
CouponSchema.index({ code: 1 }, { unique: true });
CouponSchema.index({ is_active: 1, valid_from: 1, valid_until: 1 });
CouponSchema.index({ used_count: 1 });

export default mongoose.model<ICoupon>('Coupon', CouponSchema, 'app_d8d4_coupons');