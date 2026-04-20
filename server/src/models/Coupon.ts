import { Schema, model, models } from 'mongoose';

const couponSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    discount_type: {
      type: String,
      enum: ['percent', 'fixed'],
      required: true,
    },
    discount_value: {
      type: Number,
      required: true,
      min: 0,
    },
    min_order_value: {
      type: Number,
      default: 0,
    },
    max_uses: {
      type: Number,
      default: Infinity,
    },
    used_count: {
      type: Number,
      default: 0,
    },
    valid_from: {
      type: Date,
      required: true,
    },
    valid_until: {
      type: Date,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: 'app_d8d4_coupons',
  }
);

couponSchema.index({ code: 1 }, { unique: true });
couponSchema.index({ active: 1, valid_from: 1, valid_until: 1 });

export default models.Coupon || model('Coupon', couponSchema);