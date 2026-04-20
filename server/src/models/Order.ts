import { Schema, model, models } from 'mongoose';

const OrderSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  order_number: { type: String, required: true, unique: true },
  items: [
    {
      product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      seller_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      variant: { type: String },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      status: { type: String, enum: ['placed', 'confirmed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'], default: 'placed' },
    },
  ],
  address: {
    line1: { type: String, required: true },
    line2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postal_code: { type: String, required: true },
    country: { type: String, required: true },
  },
  delivery_speed: { type: String, enum: ['standard', 'express', 'same_day'], required: true },
  payment_method: { type: String, enum: ['stripe', 'upi', 'cod'], required: true },
  payment_status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
  stripe_session_id: { type: String },
  stripe_payment_intent_id: { type: String },
  subtotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  coupon_code: { type: String },
  delivery_charge: { type: Number, required: true },
  total: { type: Number, required: true },
  status: { type: String, enum: ['placed', 'confirmed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'], default: 'placed' },
  tracking_number: { type: String },
  estimated_delivery: { type: Date },
  delivered_at: { type: Date },
}, {
  timestamps: true,
});

// Index for faster queries
OrderSchema.index({ user_id: 1, created_at: -1 });
OrderSchema.index({ order_number: 1 }, { unique: true });
OrderSchema.index({ stripe_session_id: 1 }, { unique: true, sparse: true });

export const Order = models.Order || model('Order', OrderSchema);