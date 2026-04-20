import mongoose, { Document, Schema } from 'mongoose';

export interface ICoupon extends Document {
  code: string;
  discountType: 'percent' | 'fixed';
  discountValue: number;
  minOrderValue?: number;
  expiryDate: Date;
  usageLimit?: number;
  usedCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const CouponSchema = new Schema<ICoupon>(
  {
    code: {
      type: String,
      required: [true, 'Coupon code is required'],
      unique: true,
      uppercase: true,
      trim: true,
      maxlength: [20, 'Coupon code cannot exceed 20 characters'],
    },
    discountType: {
      type: String,
      enum: ['percent', 'fixed'],
      required: [true, 'Discount type is required'],
    },
    discountValue: {
      type: Number,
      required: [true, 'Discount value is required'],
      min: [0, 'Discount value cannot be negative'],
      validate: {
        validator: function (this: ICoupon, value: number) {
          if (this.discountType === 'percent') return value <= 100;
          return true;
        },
        message: 'Percent discount cannot exceed 100%',
      },
    },
    minOrderValue: {
      type: Number,
      min: [0, 'Minimum order value cannot be negative'],
    },
    expiryDate: {
      type: Date,
      required: [true, 'Expiry date is required'],
    },
    usageLimit: {
      type: Number,
      min: [1, 'Usage limit must be at least 1'],
    },
    usedCount: {
      type: Number,
      default: 0,
      min: [0, 'Used count cannot be negative'],
    },
  },
  {
    timestamps: true,
  }
);

// Index for coupon code lookup and expiry checks
CouponSchema.index({ code: 1 });
CouponSchema.index({ expiryDate: 1 });
CouponSchema.index({ usedCount: 1 });

export default mongoose.model<ICoupon>('Coupon', CouponSchema);