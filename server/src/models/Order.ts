import { Schema, model, models } from 'mongoose';

const orderItemSchema = new Schema({
  product_id: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  variant: {
    size: String,
    color: String,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  seller_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const addressSchema = new Schema({
  label: String,
  street: String,
  city: String,
  state: String,
  zip: String,
  country: String,
});

const orderSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    order_number: {
      type: String,
      required: true,
      unique: true,
    },
    items: [orderItemSchema],
    total_amount: {
      type: Number,
      required: true,
    },
    discount_amount: {
      type: Number,
      default: 0,
    },
    delivery_fee: {
      type: Number,
      required: true,
    },
    tax_amount: {
      type: Number,
      required: true,
    },
    payment_method: {
      type: String,
      enum: ['card', 'upi', 'cod'],
      required: true,
    },
    payment_status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    order_status: {
      type: String,
      enum: [
        'placed',
        'confirmed',
        'shipped',
        'out_for_delivery',
        'delivered',
        'cancelled',
        'returned',
      ],
      default: 'placed',
    },
    address: addressSchema,
    tracking_number: {
      type: String,
    },
    delivery_speed: {
      type: String,
      enum: ['standard', 'express', 'same-day'],
    },
    coupon_code: {
      type: String,
    },
    delivered_at: {
      type: Date,
    },
    cancelled_at: {
      type: Date,
    },
  },
  {
    timestamps: true,
    collection: 'app_d8d4_orders',
  }
);

orderSchema.index({ user_id: 1, created_at: -1 });
orderSchema.index({ order_number: 1 }, { unique: true });

export default models.Order || model('Order', orderSchema);