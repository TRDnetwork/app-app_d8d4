import { Schema, model, models } from 'mongoose';

const OrderSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  order_number: { type: String, required: true, unique: true },
  items: [
    {
      product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      title: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      seller_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    },
  ],
  total_amount: { type: Number, required: true },
  discount_amount: { type: Number, default: 0 },
  delivery_fee: { type: Number, default: 0 },
  tax_amount: { type: Number, default: 0 },
  payment_method: { type: String, required: true },
  payment_status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
  order_status: {
    type: String,
    enum: ['placed', 'confirmed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'placed',
  },
  address: {
    label: String,
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String,
  },
  tracking_number: String,
  delivery_speed: String,
  coupon_code: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  delivered_at: Date,
  cancelled_at: Date,
  payment_intent: String,
});

// Compound index for user orders
OrderSchema.index({ user_id: 1, created_at: -1 });
// Unique index on order number
OrderSchema.index({ order_number: 1 }, { unique: true });

export const Order = models.Order || model('Order', OrderSchema);